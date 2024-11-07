using System.IO.Compression;
using System.Text;

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

    public static void DecompressColumn(DataSet dataSet, string tableName, string compressedColumnName, string decompressedColumnName)
    {
        // Get the DataTable from the DataSet
        DataTable table = dataSet.Tables[tableName];

        // Add a new column to store the decompressed content if it doesn't exist
        if (!table.Columns.Contains(decompressedColumnName))
        {
            table.Columns.Add(decompressedColumnName, typeof(string));
        }

        // Loop through each row in the DataTable
        foreach (DataRow row in table.Rows)
        {
            // Get the compressed data from the specified column
            var compressedData = row[compressedColumnName] as byte[];

            if (compressedData != null)
            {
                // Decompress the data
                string decompressedString = Encoding.UTF8.GetString(DecompressGZip(compressedData));

                // Store the decompressed string in the new column
                row[decompressedColumnName] = decompressedString;
            }
        }
    }
}
