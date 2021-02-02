import os
import base64
import json
import cv2
import numpy as np
import tensorflow as tf

from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO

class DeepmechPredictionServer(BaseHTTPRequestHandler):
    srcPath = os.path.join(os.getcwd())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')  
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<html><head><title>Deepmech WebServer</title></head>", "utf-8"))
        self.wfile.write(bytes("<body>", "utf-8"))
        self.wfile.write(bytes("<p>This is the deepmech webserver.</p>", "utf-8"))
        self.wfile.write(bytes("<p>Instructions to use:</p>", "utf-8"))
        self.wfile.write(bytes("</body></html>", "utf-8"))

    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')  
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        content_length = int(self.headers.get('Content-Length'))
        body = self.rfile.read(content_length)
        print(body)
        response = BytesIO()
        response.write(b'Hello world!')
        self.wfile.write(response.getvalue())

    def predict(self, base64image):
        symbol_detector = tf.keras.models.load_model(
            os.path.join(self.srcPath, 'fcn_sym_det.h5'))
        crop_detector = tf.keras.models.load_model(
            os.path.join(self.srcPath, 'crop_detector.h5'))

        np_data = np.fromstring(base64.b64decode(base64image), np.uint8)
        image = cv2.imdecode(np_data, cv2.IMREAD_GRAYSCALE)
        
        image_tensor = tf.convert_to_tensor(image)
        image_tensor = tf.cast(image_tensor / 255, tf.float32)
        image_tensor = tf.expand_dims(image_tensor, -1)
        image_tensor = tf.expand_dims(image_tensor, 0)

        def get_bounding_boxes_nms(predictions):
            max_idx = tf.math.argmax(tf.squeeze(predictions), -1)
            node_idx = tf.where(tf.equal(max_idx, 1))
            base_idx = tf.where(tf.equal(max_idx, 2))
            all_idx = tf.concat([node_idx, base_idx], 0)

            max_val = tf.math.reduce_max(tf.squeeze(predictions), -1)

            y, x = tf.split(all_idx * 4, 2, -1)

            coords = tf.squeeze(tf.stack([y, x, y + 32, x + 32], -1))

            all_boxes = tf.cast(coords / 360, tf.float32)

            scores = tf.gather_nd(max_val, all_idx)
            nms_idx = tf.image.non_max_suppression(
                all_boxes, scores, 99, tf.keras.backend.epsilon(), 0.8)

            limit = tf.cast(tf.math.count_nonzero(node_idx, 0)[0], tf.int32)
            mask = tf.less(nms_idx, limit)
            node_mask = tf.boolean_mask(nms_idx, mask)
            base_mask = tf.boolean_mask(nms_idx,~mask)

            node_boxes = tf.gather(all_boxes, node_mask)
            base_boxes = tf.gather(all_boxes, base_mask)
            return node_boxes, base_boxes

        [nodes, bases] = get_bounding_boxes_nms(symbol_detector(image_tensor)[0])

        elements = {"nodes":[], "constraints":[]}

        counter = 1

        def appendnode(node, base, counter):
            elements["nodes"].append({
                "id": "DM" + str(counter),
                "x": int((node[1] + node[3]) / 2 * image_tensor.shape[1]),
                "y": int((node[0] + node[2]) / 2 * image_tensor.shape[2]),
                "base": base,
            })
            counter += 1

        [appendnode(node, False, counter) for node in nodes]
        [appendnode(base, True, counter) for base in bases]

        crops = []
        crops_info = []

        for node1 in elements["nodes"]:
            for node2 in elements["nodes"]: 
                x1 = min(node1["x"], node2["x"])
                y1 = min(node1["y"], node2["y"])
                x2 = max(node1["x"], node2["x"])
                y2 = max(node1["y"], node2["y"])
                # Remove images with area 0
                if x1 == x2 or y1 == y2:
                    continue

                crop = image[y1:y2, x1:x2]
                crop = cv2.resize(crop, (96, 96))

                if x1 == node2["x"]:
                    crop = cv2.flip(crop, 1)
                if y1 == node2["y"]:
                    crop = cv2.flip(crop, 0)

                crop = tf.expand_dims(crop, -1)
                crop = tf.cast(crop / 255, tf.float32)

                crops.append(crop)
                n1, n2 = node1["id"], node2["id"]
                crops_info.append({
                    "p1": n1,
                    "p2": n2,
                    "id": n1 + n2})

        for idx, pred in enumerate(crop_detector(tf.convert_to_tensor(crops))):
            argmax = tf.math.argmax(pred, -1)
            if (argmax):
                constraint = crops_info[idx]
                constraint["len"] = { "type": "const" if argmax == 1 else "free" }
                constraint["ori"] = { "type": "const" if argmax == 2 else "free" }
                elements["constraints"].append(constraint)

        # print(json.dumps(elements))
        return json.dumps(elements)

if __name__ == "__main__":        
    webServer = HTTPServer(("localhost", 8337), DeepmechPredictionServer)
    print("Starting webserver on port 8337")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

        webServer.server_close()
