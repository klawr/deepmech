
import cv2
import numpy as np
from sklearn.cluster import KMeans
from os import listdir, path, mkdir
from tqdm import tqdm

# insert directory 'n', 'o' or 'x' here:
target = 'x'
# Don't review process on the go:
auto = True

dir_path = path.join('raw', target)
processed = path.join('processed', target)
# This is not recursive
try:
    mkdir(processed)
except:
    pass

# All the image paths relative to this directory:
image_paths = [path.join(dir_path, image_name) for image_name in listdir(dir_path)]

# Divide pixels to the most and least prominent colors
def divide_colors(index, centroids):
    labels = np.arange(0, len(np.unique(index)) + 1)
    (hist, _) = np.histogram(index, bins = labels)
    hist = hist.astype("float")
    hist /= hist.sum()

    return sorted([(percent, color) for (percent, color) in zip(hist, centroids)])

def decide(np_image):
    prepared_image = np.array(np_image, dtype='uint8')
    cv2.imshow('image_check', prepared_image)
    return cv2.waitKey(0)

for image_path in tqdm(image_paths):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    new_image = np.zeros(image.shape)

    # Need two different colors in image
    if np.any(image - image[0][0]):
        # Divide colors into two clusters
        cluster = KMeans(n_clusters=2).fit(image.reshape((-1, 1)))
        less, more = divide_colors(cluster.labels_, cluster.cluster_centers_)
        # Flip every pixel which is closer to 'less'
        new_image = np.where(abs(image - less[1]) < abs(image - more[1]), 255, 0)

    basename = path.basename(path.splitext(image_path)[0] + '.png')
    target_path = path.join(processed, basename)

    if auto:
        cv2.imwrite(target_path, new_image)
    # interactive mode:
    else:
        key = decide(new_image)
        while key != 27 and key != 13:
            new_image = 255 - new_image
            key = decide(new_image)
        if (key == 27): # ESC
            break
        if (key == 13): # ENTER
            cv2.imwrite(target_path, new_image)

cv2.destroyAllWindows()
