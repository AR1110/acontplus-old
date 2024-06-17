using BarcodeStandard;
using Type = BarcodeStandard.Type;

namespace Common.Core.Utils;

public static class BarcodeGen
{
    public static byte[] Create(string text, bool label = false)
    {
        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        using var memoryStream = new MemoryStream();
        var b = new Barcode();
        b.IncludeLabel = label;
        b.Encode(Type.Code128, text, 1000, 100);
        b.SaveImage(memoryStream, SaveTypes.Png);
        return memoryStream.ToArray();


        //var writer = new ZXing.Windows.Compatibility.BarcodeWriter
        //{
        //    Format = BarcodeFormat.CODE_128,
        //    Options = new EncodingOptions
        //    {
        //        Width = 300,
        //        Height = 100,
        //        PureBarcode = label,
        //    },
        //};

        //var bitmap = writer.Write(text);

        //using (var memoryStream = new MemoryStream())
        //{
        //    bitmap.Save(memoryStream, ImageFormat.Png);

        //    return memoryStream.ToArray();
        //}
    }
}
