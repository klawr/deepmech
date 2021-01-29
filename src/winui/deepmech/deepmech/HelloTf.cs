using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace deepmech
{
    static class HelloTf
    {
        public static string Predict(Image<A8> bitmap)
        {
            int width = bitmap.Width;
            int height = bitmap.Height;

            Span<A8> pixels;
            if (!bitmap.TryGetSinglePixelSpan(out pixels))
            {
                throw new Exception("NOOOOOOO!");
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
                hello_free(resultNativeString);
            }
        }

        [DllImport("hello_tf")]
        private extern static IntPtr predict(in byte[] imageData, in uint width, in uint hate);

        [DllImport("hello_tf")]
        private extern static void hello_free(in IntPtr str);
    }
}
