using Microsoft.Toolkit.Win32.UI.Controls.Interop.WinRT;
using Microsoft.Web.WebView2.Core;
using System.Windows;

namespace deepmech
{
    public partial class MainWindow : Window
    {
        private bool _deepmechActive;
        public bool deepmechActive
        {
            set
            {
                deepmechWebView.Width = value ? 0 : double.NaN;
                _deepmechActive = value;
            }
            get { return _deepmechActive; }
        }

        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();
            // Set supported inking device types.
            deepmechCanvas.InkPresenter.InputDeviceTypes = CoreInputDeviceTypes.Mouse | CoreInputDeviceTypes.Pen;
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

            var message = System.Text.Json.JsonSerializer.Deserialize<
                System.Collections.Generic.Dictionary<string, string>>(args.TryGetWebMessageAsString());

            deepmechActive = message?["deepmech"] == "true";

            deepmechWebView.ExecuteScriptAsync("console.log(" + args.WebMessageAsJson + ")");
        }

        private void Exit_Deepmech(object sender, RoutedEventArgs e)
        {
            deepmechActive = false;
        }
    }
}
