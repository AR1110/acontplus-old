using System.IO.Compression;

namespace Common.Core.Utils
{
    public static class CompressionHelper
    {
        public static byte[] Compress(byte[] data)
        {
            byte[] compressArray = null;
            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    using (var deflateStream = new DeflateStream(memoryStream, CompressionMode.Compress))
                    {
                        deflateStream.Write(data, 0, data.Length);
                    }
                    compressArray = memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return compressArray;
        }
        public static byte[] Decompress(byte[] data)
        {
            byte[] decompressedArray = null;
            try
            {
                var decompressedStream = new MemoryStream();
                using (var compressStream = new MemoryStream(data))
                {
                    var deflateStream = new DeflateStream(compressStream, CompressionMode.Decompress);
                    deflateStream.CopyTo(decompressedStream);
                }
                decompressedArray = decompressedStream.ToArray();
            }
            catch (Exception ex)
            {
                throw;
            }

            return decompressedArray;
        }
    }
}
