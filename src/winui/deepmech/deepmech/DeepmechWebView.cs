﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Web.WebView2.Core;
using Microsoft.UI.Xaml.Controls;
using System.Text.Json;

namespace deepmech
{
    class DeepmechWebView : IDisposable
    {
        WebView2 WebView;
        IntPtr Deepmech_ctx;

        //private bool _deepmechActive;
        //public bool DeepmechActive
        //{
        //    set
        //    {
        //        WebView.Width = value ? 0 : double.NaN;
        //        _deepmechActive = value;
        //    }
        //    get { return _deepmechActive; }
        //}

        public DeepmechWebView(WebView2 webview)
        {
            WebView = webview;
            var a = Properties.Resources.fcn_sym_det;
            var symbolModel = Encoding.UTF8.GetString(a, 0, a.Length);
            var b = Properties.Resources.crop_detector;
            var cropModel = Encoding.UTF8.GetString(b, 0, b.Length);
            Deepmech_ctx = Deepmech_cxx.create_deepmech_ctx(symbolModel, cropModel);
        }

        private string WebviewPlaceholder(string message) => "globalThis.webviewEventListenerPlaceholder(" + message + ")";

        //public void ExitDeepmech()
        //{
        //    WebView.ExecuteScriptAsync(WebviewPlaceholder("{deepmech: false}"));
        //}

        public void SendModelUpdate(string json)
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder("{prediction: " + json + "}"));
        }

        public void Register(bool canvas, bool prediction)
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder("{register:{canvas: false, prediction: true}}"));
        }

        private void Predict(string prediction)
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder($"{{prediction: {prediction}}}"));
        }

        private class DeepmechMessage
        {
            public string image { get; set; }
            public bool ready { get; set; }
            public string nodes { get; set; }
        }

        public void ProcessWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            // If the source is not validated, don't process the message.
            if (e.Source != WebView.Source.ToString()) //sender.Source.ToString()
            {
                return;
            }

            var message = JsonSerializer.Deserialize<DeepmechMessage>(e.TryGetWebMessageAsString());

            if (message == null) return;
            if (message.ready)
            {
                Register(canvas: false, prediction: true);
            }
            if (message.image != null)
            {
                Predict(Deepmech_cxx.Predict(Deepmech_ctx, message.image, message.nodes));
            }
        }

        public void Dispose()
        {
            Deepmech_cxx.destroy_deepmech_ctx(Deepmech_ctx);
        }
    }
}
