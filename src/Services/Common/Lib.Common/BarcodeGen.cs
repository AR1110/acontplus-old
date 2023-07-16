using IronBarCode;

namespace Lib.Common
{
    public static class BarcodeGen
    {
        public static byte[] Create(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return null;
            }
            var myBarcode = BarcodeWriter.CreateBarcode(text, BarcodeWriterEncoding.Code128, 1000, 100);

            //MemoryStream memoryStream = new MemoryStream();
            ////Image codigoBarras;
            ////BarcodeLib.Barcode Codigo = new BarcodeLib.Barcode();
            ////Codigo.IncludeLabel = false;
            ////codigoBarras = Codigo.Encode(BarcodeLib.TYPE.CODE128, text, Color.Black, Color.White, 1000, 100);
            ////codigoBarras.Save(memoryStream, ImageFormat.Png);

            //////download imagen
            //////var imgTemp = new Bitmap(memoryStream);
            //////var img = new Bitmap(imageTemporal, new Size(new Point(400, 100)));
            //////img.Save("C:/temp/" + text + ".png", ImageFormat.Png);

            ////// very important to reset memory stream to a starting position, otherwise you would get 0 bytes returned

            byte[] PngBytes = myBarcode.ToPngBinaryData();
            return PngBytes;
        }
    }
}
