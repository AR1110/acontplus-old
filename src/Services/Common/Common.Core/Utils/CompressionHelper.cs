using System.IO.Compression;

namespace Common.Core.Utils
{
    public static class CompressionHelper
    {
        public static byte[] Compress(byte[] data)
        {
            if (data == null) throw new ArgumentNullException(nameof(data));

            using var memoryStream = new MemoryStream();
            using (var deflateStream = new DeflateStream(memoryStream, CompressionMode.Compress, true))
            {
                deflateStream.Write(data, 0, data.Length);
            }

            return memoryStream.ToArray();
        }

        public static byte[] Decompress(byte[] data)
        {
            if (data == null) throw new ArgumentNullException(nameof(data));

            using var compressStream = new MemoryStream(data);
            using var deflateStream = new DeflateStream(compressStream, CompressionMode.Decompress);
            using var decompressedStream = new MemoryStream();

            deflateStream.CopyTo(decompressedStream);

            return decompressedStream.ToArray();
        }
    }
}
