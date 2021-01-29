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
        [DllImport("hello_tf")]
        private extern static IntPtr predict(IntPtr imageData, uint width, uint hate);

        [DllImport("hello_tf")]
        private extern static void hello_free(IntPtr str);

        public static string Predict() { }
    }
}
