using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.Diagnostics;
using Microsoft.Web.WebView2.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using Windows.Storage.Streams;
using Windows.UI.Core;


// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace deepmech
{
    /// <summary>
    /// An empty window that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainWindow : Window
    {
        // private DeepmechPredictionServer DeepmechServer { get; }
        private DeepmechWebView Communicator { get; }

        private readonly Uri URL = new Uri(Debugger.IsAttached ?
                "http://localhost:8001" :
                "https://deepmech.klawr.de");

        public MainWindow()
        {
            InitializeComponent();

            deepmechWebView.Source = URL;
            InitializeAsync();
            deepmechCanvas.RequiresPointer = RequiresPointer.WhenEngaged;
            //deepmechCanvas.InkPresenter.InputDeviceTypes = CoreInputDeviceTypes.Mouse | CoreInputDeviceTypes.Pen;

            Communicator = new DeepmechWebView(deepmechWebView, deepmechCanvas);
        }

        async void InitializeAsync()
        {
            await deepmechWebView.EnsureCoreWebView2Async();
            deepmechWebView.CoreWebView2.WebMessageReceived += Communicator.ProcessWebMessage;

            if (Debugger.IsAttached)
            {
                deepmechWebView.CoreWebView2.OpenDevToolsWindow();
            }
        }

        public void ExitDeepmech(object sender, RoutedEventArgs e)
        {
            Communicator.ExitDeepmech();
        }

        private async void Predict(object sender, RoutedEventArgs e)
        {
            var image = await ReadDeepmechCanvas();
            if (image == null)
            {
                throw new Exception("Canvas contains no image.");
            };
            var prediction = HelloTf.Predict(image);
            Communicator.SendModelUpdate(prediction);
        }


        private async Task<Image<A8>> ReadDeepmechCanvas()
        {
            var strokes = deepmechCanvas.ExportInkStrokes();
            if (strokes.Count == 0) return null;

            // Make strokes white
            var attributes = new List<Windows.UI.Input.Inking.InkDrawingAttributes>();
            foreach (var stroke in strokes)
            {
                attributes.Add(stroke.DrawingAttributes);
                // Make all strokes black
                var DA = stroke.Clone().DrawingAttributes;
                DA.Color = Windows.UI.Color.FromArgb(0, 255, 255, 255);
                stroke.DrawingAttributes = DA;
            }



            Image<A8> image;
            // Draw strokes and encode image into base64 string
            using (var stream = new InMemoryRandomAccessStream())
            {
                await deepmechCanvas.SaveBitmapAsync(stream, 0);
                image = SixLabors.ImageSharp.Image.Load<A8>(stream.AsStream());
            }


            // Revert color of strokes.
            for (var i = 0; i < strokes.Count; ++i)
            {
                strokes[i].DrawingAttributes = attributes[i];
            }

            return image;
        }

    }
}
