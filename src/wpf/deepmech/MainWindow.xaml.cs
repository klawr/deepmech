using Microsoft.Toolkit.Win32.UI.Controls.Interop.WinRT;
using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using Windows.Storage.Streams;
using System.Net.Http;
using Microsoft.Web.WebView2.Wpf;
using System.Net.Http.Json;

namespace deepmech
{
    public partial class MainWindow : Window
    {
        private DeepmechWebView Communicator { get; }

        private readonly Uri URL = new Uri(Debugger.IsAttached ?
                "http://localhost:8001" :
                "https://deepmech.klawr.de");

        public MainWindow()
        {
            InitializeComponent();
            deepmechWebView.Source = URL;
            Communicator = new DeepmechWebView(deepmechWebView);

            InitializeAsync();
        }

        async void InitializeAsync()
        {
            await deepmechWebView.EnsureCoreWebView2Async(null);
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
