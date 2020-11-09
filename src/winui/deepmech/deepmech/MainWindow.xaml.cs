using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace deepmech
{
    public sealed partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            deepmechWebView.WebMessageReceived += (WebView2 sender, WebView2WebMessageReceivedEventArgs args) =>
            {
                // Important to validate that the Uri is what we expect from that webview.
                string uriAsString = sender.Source.ToString();

                if (args.Source == uriAsString)
                {
                    deepmechWebView.ExecuteScriptAsync("console.log('Got the message')");
                }

                else
                {
                    // If the source is not validated, don't process the message.
                    return;
                }
            };
        }
    }
}
