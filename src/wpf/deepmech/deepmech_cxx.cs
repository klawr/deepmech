using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.Text;
using System.Threading.Tasks;

namespace deepmech
{
    static class Deepmech_cxx
    {
        public static string Predict(IntPtr deepmech_ctx, string base64, uint[] nodes = default(uint[]))
            => Predict(deepmech_ctx, Image.Load<A8>(Convert.FromBase64String(base64)), nodes);

        public static string Predict(IntPtr deepmech_ctx, Image<A8> bitmap, uint[] nodes = default(uint[]))
        {
            int width = bitmap.Width;
            int height = bitmap.Height;

            Span<A8> pixels;
            if (!bitmap.TryGetSinglePixelSpan(out pixels))
            {
                throw new Exception("NOOOOOOO!");
            }
            for (var i = 0; i < pixels.Length; ++i)
            {
                pixels[i] = new A8((byte)((uint)pixels[i].PackedValue == 0 ? 255 : 0));
            }
            var bytes = MemoryMarshal.AsBytes(pixels).ToArray();

            var resultNativeString = predict(deepmech_ctx, bytes, (uint)width, (uint)height, nodes, (uint)nodes.Length);

            try
            {
                var jsonString = Marshal.PtrToStringUTF8(resultNativeString);
                if (jsonString == null)
                {
                    throw new Exception("failed");
                }
                return jsonString;
            }
            finally
            {
                deepmech_cxx_free(resultNativeString);
            }
        }

        [DllImport("deepmech_cxx")]
        public static extern IntPtr create_deepmech_ctx([MarshalAs(UnmanagedType.LPStr)] string symbolModel, [MarshalAs(UnmanagedType.LPStr)] string cropModel);

        [DllImport("deepmech_cxx")]
        private extern static IntPtr predict(IntPtr deepmech_ctx, byte[] imageData, uint width, uint height, uint[] nodes, uint length);

        [DllImport("deepmech_cxx")]
        private extern static void deepmech_cxx_free(IntPtr str);
    }
}
