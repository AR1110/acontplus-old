using BarcodeStandard;

namespace Common.Core.Utils
{
    public static class BarcodeGen
    {
        public static byte[] Create(string text, bool label = false)
        {
            if (string.IsNullOrEmpty(text))
            {
                return null;
            }
            var memoryStream = new MemoryStream();
            var b = new Barcode();
            b.IncludeLabel = label;
            b.Encode(BarcodeStandard.Type.Code128, text, 1000, 100);
            b.SaveImage(memoryStream, SaveTypes.Png);
            return memoryStream.ToArray();
        }
    }
}
