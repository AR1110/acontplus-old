using System;
using System.IO;
using System.IO.Compression;

namespace Helpers
{
    public static class CompressionHelper
    {
        public static byte[] Compress(byte[] data)
        {
            byte[] compressArray = null;
            try
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (DeflateStream deflateStream = new DeflateStream(memoryStream, CompressionMode.Compress))
                    {
                        deflateStream.Write(data, 0, data.Length);
                    }
                    compressArray = memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                return null;
            }
            return compressArray;
        }
        public static byte[] Decompress(byte[] data)
        {
            byte[] decompressedArray = null;
            try
            {
               MemoryStream decompressedStream = new MemoryStream();
                using (MemoryStream compressStream = new MemoryStream(data))
                {
                    DeflateStream deflateStream = new DeflateStream(compressStream, CompressionMode.Decompress);
                    deflateStream.CopyTo(decompressedStream);
                }
                decompressedArray = decompressedStream.ToArray();
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                return null;
            }

            return decompressedArray;
        }
    }
}
