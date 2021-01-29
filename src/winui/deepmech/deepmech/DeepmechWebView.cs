using Microsoft.Toolkit.Uwp.UI.Controls;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace deepmech
{
    public class DeepmechWebView
    {
        WebView2 WebView;
        InfiniteCanvas Panel;

        private bool _deepmechActive;
        public bool DeepmechActive
        {
            set
            {
                WebView.Visibility = value ? Visibility.Collapsed : Visibility.Visible;
                Panel.Visibility = !value ? Visibility.Collapsed : Visibility.Visible;
                _deepmechActive = value;
            }
            get { return _deepmechActive; }
        }

        public DeepmechWebView(WebView2 webview, InfiniteCanvas panel)
        {
            WebView = webview;
            Panel = panel;
        }

        private string WebviewPlaceholder(string message) => "window.webviewEventListenerPlaceholder(" + message + ")";

        public async void ExitDeepmech()
        {
            await WebView.ExecuteScriptAsync(WebviewPlaceholder("{deepmech: false}"));
        }

        public async void SendModelUpdate(string json)
        {
            await WebView.ExecuteScriptAsync(WebviewPlaceholder("{update: " + json + "}"));
        }
        public void ProcessWebMessage(CoreWebView2 sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            // If the source is not validated, don't process the message.
            if (args.Source != WebView.Source.ToString()) //sender.Source.ToString()
            {
                return;
            }

            try
            {
                var message = System.Text.Json.JsonSerializer.Deserialize<
                System.Collections.Generic.Dictionary<string, string>>(args.TryGetWebMessageAsString());

                // Toggle canvas if deepmech is active
                DeepmechActive = message?["deepmech"] == "true";
            }
            catch (Exception)
            {
                // Can not deserialze message warning or something...
            }
        }
    }
}
