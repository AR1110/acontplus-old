using SkiaSharp;
using ZXing;
using ZXing.Common;
using ZXing.SkiaSharp.Rendering;

namespace Common.Core.Utils;

public class BarcodeConfig
{
    public string Text { get; set; } = string.Empty; // The text to encode
    public BarcodeFormat Format { get; set; } = BarcodeFormat.CODE_128; // Barcode format
    public int Width { get; set; } = 300; // Barcode width
    public int Height { get; set; } = 100; // Barcode height
    public bool IncludeLabel { get; set; } = false; // Include label below the barcode
    public int Margin { get; set; } = 10; // Margin around the barcode
    public SKEncodedImageFormat OutputFormat { get; set; } = SKEncodedImageFormat.Png; // Output image format
    public int Quality { get; set; } = 100; // Image quality (for formats like JPEG)
    public EncodingOptions AdditionalOptions { get; set; } // Custom encoding options
}

public static class BarcodeGen
{
    public static byte[] Create(BarcodeConfig config)
    {
        if (string.IsNullOrEmpty(config.Text))
            throw new ArgumentException("Text cannot be null or empty", nameof(config.Text));

        // Merge default options with additional options
        var options = config.AdditionalOptions ?? new EncodingOptions();
        options.Width = config.Width;
        options.Height = config.Height;
        options.Margin = config.Margin;
        options.PureBarcode = !config.IncludeLabel;

        // Create a barcode writer
        var writer = new BarcodeWriter<SKBitmap>
        {
            Format = config.Format,
            Options = options,
            Renderer = new SKBitmapRenderer()
        };

        // Generate the barcode
        var barcodeBitmap = writer.Write(config.Text);

        // Encode the barcode image
        using var image = SKImage.FromBitmap(barcodeBitmap);
        using var data = image.Encode(config.OutputFormat, config.Quality);
        using var memoryStream = new MemoryStream();
        data.SaveTo(memoryStream);

        return memoryStream.ToArray();
    }
}
