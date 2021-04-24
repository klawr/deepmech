using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Native.Py.Torch.RNNativePyTorch
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNNativePyTorchModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNNativePyTorchModule"/>.
        /// </summary>
        internal RNNativePyTorchModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNNativePyTorch";
            }
        }
    }
}
