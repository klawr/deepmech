using Microsoft.Web.WebView2.Core;
using System.Windows;

namespace deepmech
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();
        }

        async void InitializeAsync()
        {
            await deepmechWebView.EnsureCoreWebView2Async(null);
            deepmechWebView.CoreWebView2.WebMessageReceived += AnswerWebMessage;
        }

        void AnswerWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            // Important to validate that the Uri is what we expect from that webview.
            string uriAsString = deepmechWebView.Source.ToString(); //sender.Source.ToString();

            // If the source is not validated, don't process the message.
            if (args.Source != uriAsString)
            {
                return;
            }

            deepmechWebView.ExecuteScriptAsync("console.log(" + args.WebMessageAsJson + ")");
        }
    }
}
