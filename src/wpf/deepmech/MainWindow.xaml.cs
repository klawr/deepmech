using Microsoft.Toolkit.Win32.UI.Controls.Interop.WinRT;
using Microsoft.Web.WebView2.Core;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using Windows.Storage.Streams;

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

        private Uri URL = new Uri(System.Diagnostics.Debugger.IsAttached ?
            "http://localhost:8001" : "https://deepmech.klawr.de");

        public MainWindow()
        {
            InitializeComponent();
            deepmechWebView.Source = URL;
            InitializeAsync();
            deepmechCanvas.InkPresenter.InputDeviceTypes = CoreInputDeviceTypes.Mouse | CoreInputDeviceTypes.Pen;
        }

        async void InitializeAsync()
        {
            await deepmechWebView.EnsureCoreWebView2Async(null);
            deepmechWebView.CoreWebView2.WebMessageReceived += ProcessWebMessage;

            if (System.Diagnostics.Debugger.IsAttached)
            {
                deepmechWebView.CoreWebView2.OpenDevToolsWindow();
            }
        }

        void ProcessWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            // If the source is not validated, don't process the message.
            if (args.Source != deepmechWebView.Source.ToString()) //sender.Source.ToString()
            {
                return;
            }

            try
            {
                var message = System.Text.Json.JsonSerializer.Deserialize<
                System.Collections.Generic.Dictionary<string, string>>(args.TryGetWebMessageAsString());

                // Toggle canvas if deepmech is active
                deepmechActive = message?["deepmech"] == "true";
            }
            catch (Exception e)
            {
                // Can not deserialze message warning or something...
            }
        }

        // This is not as described in
        // https://docs.microsoft.com/en-us/microsoft-edge/webview2/gettingstarted/winforms#step-8---communication-between-host-and-web-content
        // But it does not work that way ¯\_(ツ)_/¯
        private string webviewPlaceholder(string message) => "window.webviewEventListenerPlaceholder(" + message + ")";

        private void Exit_Deepmech(object sender, System.Windows.RoutedEventArgs e)
        {
            deepmechWebView.ExecuteScriptAsync(webviewPlaceholder("{deepmech: false}"));
        }

        private async Task ReadDeepmechCanvas(string path)
        {
            var strokes = deepmechCanvas.InkPresenter.StrokeContainer.GetStrokes();
            var tmp = Path.GetTempFileName();
            if (strokes.Count > 0)
            {
                using (IOutputStream outputStream = File.Open(tmp, FileMode.Create).AsOutputStream())
                {
                    await deepmechCanvas.InkPresenter.StrokeContainer.SaveAsync(outputStream);
                    await outputStream.FlushAsync();
                }
                Image.FromFile(tmp).Save(path, System.Drawing.Imaging.ImageFormat.Png);
            }
        }

        private async void Predict(object sender, RoutedEventArgs e)
        {
            var sourcePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "Resources");
            // Get image
            await ReadDeepmechCanvas(Path.Combine(Path.GetTempPath(), "deepmechCanvas.png"));

            // Call python with image
            var pythonResponse = new Python(Path.Combine(sourcePath, "env", "Scripts", "python.exe"))
                .Run(Path.Combine(sourcePath, "predict.py"));
            // Return predictions on mec2
        }

        private class Python
        {
            public readonly string PythonPath;

            public Python(string pythonPath)
            {
                PythonPath = pythonPath;
            }

            public string Run(string scriptPath)
            {
                using (Process process = new Process())
                {
                    process.StartInfo = new ProcessStartInfo(PythonPath)
                    {
                        Arguments = scriptPath,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    };
                    process.Start();
                    var output = process.StandardOutput
                        .ReadToEnd();
                        //.Replace(Environment.NewLine, string.Empty);
                    var error = process.StandardError.ReadToEnd(); // Do something with error?
                    process.WaitForExit();

                    return output;
                }
            }
        }
    }
}
