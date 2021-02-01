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
    public sealed partial class MainWindow : Window
    {
        private DeepmechWebView Communicator { get; }

        private readonly Uri URL = new Uri(Debugger.IsAttached ?
                "http://localhost:8001" :
                "https://deepmech.klawr.de");


        public MainWindow()
        {
            InitializeComponent();

            deepmechWebView.Source = URL;
            InitializeAsync();
            //deepmechCanvas.InkPresenter.InputDeviceTypes = CoreInputDeviceTypes.Mouse | CoreInputDeviceTypes.Pen;

            Communicator = new DeepmechWebView(deepmechWebView);
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

        //private void ExitDeepmech(object sender, RoutedEventArgs e)
        //{
        //    Communicator.ExitDeepmech();
        //}

        //private void Predict(object sender, RoutedEventArgs e)
        //{
        //    Communicator.Predict()
        //}
    }
}
