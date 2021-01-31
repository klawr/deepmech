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
    static class Deepmech_cc
    {
        public static string Predict(string base64)
            => Predict(Image.Load<A8>(Convert.FromBase64String(base64)));

        public static string Predict(Image<A8> bitmap)
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

            var resultNativeString = predict(bytes, (uint)width, (uint)height);

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
                deepmech_cc_free(resultNativeString);
            }
        }

        [DllImport("deepmech_cc")]
        private extern static IntPtr predict(byte[] imageData, uint width, uint height);

        [DllImport("deepmech_cc")]
        private extern static void deepmech_cc_free(IntPtr str);
    }
}
