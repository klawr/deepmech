using System;
using System.Collections.Generic;
using Microsoft.Web.WebView2.Wpf;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Web.WebView2.Core;

namespace deepmech
{
    class DeepmechWebView
    {
        WebView2 WebView;

        private bool _deepmechActive;
        public bool DeepmechActive
        {
            set
            {
                WebView.Width = value ? 0 : double.NaN;
                _deepmechActive = value;
            }
            get { return _deepmechActive; }
        }

        public DeepmechWebView(WebView2 webview)
        {
            WebView = webview;
        }

        private string WebviewPlaceholder(string message) => "globalThis.webviewEventListenerPlaceholder(" + message + ")";

        public void ExitDeepmech()
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder("{deepmech: false}"));
        }

        public void SendModelUpdate(string json)
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder("{prediction: " + json + "}"));
        }

        public void Register(bool canvas, bool prediction)
        {
            WebView.ExecuteScriptAsync(WebviewPlaceholder("{register:{canvas: false, prediction: true}}"));
        }

        public void ProcessWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            // If the source is not validated, don't process the message.
            if (e.Source != WebView.Source.ToString()) //sender.Source.ToString()
            {
                return;
            }

            // TODO try serialize...
            var message = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(e.TryGetWebMessageAsString());

            if (message == null) return;
            if (message.TryGetValue("ready", out var ready) && ready == "true")
            {
                Register(canvas: false, prediction: true);
            }
            if (message.TryGetValue("image", out var base64))
            {
                WebView.ExecuteScriptAsync(WebviewPlaceholder($"{{prediction: {Deepmech_cc.Predict(base64)}}}"));
            }
        }
    }
}
