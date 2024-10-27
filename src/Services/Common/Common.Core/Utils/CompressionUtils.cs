using System.IO.Compression;

namespace Common.Core.Utils;

public static class CompressionUtils
{
    // Deflate Compression
    public static byte[] CompressDeflate(byte[] data)
    {
        if (data == null)
        {
            throw new ArgumentNullException(nameof(data));
        }

        using var memoryStream = new MemoryStream();
        using (var deflateStream = new DeflateStream(memoryStream, CompressionMode.Compress, true))
        {
            deflateStream.Write(data, 0, data.Length);
        }

        return memoryStream.ToArray();
    }

    // Deflate Decompression
    public static byte[] DecompressDeflate(byte[] data)
    {
        if (data == null)
        {
            throw new ArgumentNullException(nameof(data));
        }

        using (var compressStream = new MemoryStream(data))
        using (var deflateStream = new DeflateStream(compressStream, CompressionMode.Decompress))
        using (var decompressedStream = new MemoryStream())
        {
            deflateStream.CopyTo(decompressedStream);
            return decompressedStream.ToArray();
        }
    }
    // GZip Compression
    public static byte[] CompressGZip(byte[] data)
    {
        if (data == null)
        {
            throw new ArgumentNullException(nameof(data));
        }

        using var memoryStream = new MemoryStream();
        using (var gzipStream = new GZipStream(memoryStream, CompressionMode.Compress, true))
        {
            gzipStream.Write(data, 0, data.Length);
        }

        return memoryStream.ToArray();
    }

    // GZip Decompression
    public static byte[] DecompressGZip(byte[] data)
    {
        if (data == null)
        {
            throw new ArgumentNullException(nameof(data));
        }

        using var compressStream = new MemoryStream(data);
        using var gzipStream = new GZipStream(compressStream, CompressionMode.Decompress);
        using var decompressedStream = new MemoryStream();
        {
            gzipStream.CopyTo(decompressedStream);
            return decompressedStream.ToArray();
        }
    }
}
