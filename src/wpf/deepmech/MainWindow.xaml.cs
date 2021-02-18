using System;
using System.Diagnostics;
using System.Windows;

namespace deepmech
{
    public partial class MainWindow : Window
    {
        private DeepmechWebView DeepmechHandler { get; }

        private readonly Uri URL = new Uri(Debugger.IsAttached ?
                "http://localhost:8001" :
                "https://deepmech.klawr.de");

        public MainWindow()
        {
            InitializeComponent();
            deepmechWebView.Source = URL;
            DeepmechHandler = new DeepmechWebView(deepmechWebView);

            InitializeAsync();
        }

        async void InitializeAsync()
        {
            await deepmechWebView.EnsureCoreWebView2Async(null);
            deepmechWebView.CoreWebView2.WebMessageReceived += DeepmechHandler.ProcessWebMessage;

            if (Debugger.IsAttached)
            {
                deepmechWebView.CoreWebView2.OpenDevToolsWindow();
            }
        }

        //private void ExitDeepmech(object sender, RoutedEventArgs e)
        //{
        //    DeepmechHandler.ExitDeepmech();
        //}

        //private void Predict(object sender, RoutedEventArgs e)
        //{
        //    DeepmechHandler.Predict()
        //}
    }
}
