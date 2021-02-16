using System;
using System.Text;
using Microsoft.Web.WebView2.Wpf;
using System.Text.Json;
using Microsoft.Web.WebView2.Core;

namespace deepmech
{
    public sealed class DeepmechWebView : IDisposable
    {
        WebView2 WebView;
        IntPtr Deepmech_ctx;

        // Not used when canvas is not supported.
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

        private bool isDisposed;
        public void Dispose()
        {
            if (isDisposed) return;

            Deepmech_cxx.destroy_deepmech_ctx(Deepmech_ctx);
            Deepmech_ctx = IntPtr.Zero;
            isDisposed = true;
        }

        ~DeepmechWebView()
        {
            Dispose();
        }
    }
}
