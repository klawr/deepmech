﻿using Microsoft.Toolkit.Win32.UI.Controls.Interop.WinRT;
using Microsoft.Web.WebView2.Core;
using System;
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
            deepmechWebView.CoreWebView2.WebMessageReceived += ProcessWebMessage;

            if (System.Diagnostics.Debugger.IsAttached)
            {
                deepmechWebView.CoreWebView2.OpenDevToolsWindow();
            }
        }

        void ProcessWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            // Important to validate that the Uri is what we expect from that webview.
            string uriAsString = deepmechWebView.Source.ToString(); //sender.Source.ToString();

            // If the source is not validated, don't process the message.
            if (args.Source != uriAsString)
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
        private string webviewPlaceholder(string message) => "window.webviewEventListenerPlaceholder(" + message +")";

        private void Exit_Deepmech(object sender, RoutedEventArgs e)
        {
            // Please note that false is no string here...
            deepmechWebView.ExecuteScriptAsync(webviewPlaceholder("{deepmech: false}"));

            //deepmechWebView.ExecuteScriptAsync("window.webviewEventListenerPlaceholder('{\"deepmech\": false}')");
        }
    }
}