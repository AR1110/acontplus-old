using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace SignerWS
{
    public class FileExtensionsNS
    {
        public string GetValidFileName(string fileName)
        {
            // remove any invalid character from the filename.
            String ret = Regex.Replace(fileName.Trim(), "[^A-Za-z0-9_. ]+", "");
            return ret.Replace(" ", String.Empty);
        }

        //public byte[] GetByteAsync(HttpPostedFileBase file)
        //{
        //    byte[] fileBytes = null;
        //    using (MemoryStream ms = new MemoryStream())
        //    {
        //        file.InputStream.CopyTo(ms);
        //        fileBytes = ms.ToArray();
        //        //string s = Convert.ToBase64String(fileBytes);                
        //    }
        //    return fileBytes;
        //}
        //ENCODE BYTE TO BASE 64
        public string EncodeTo64(string toEncode)
        {
            byte[] encode = Encoding.UTF8.GetBytes(toEncode);
            string response = Convert.ToBase64String(encode);
            return response;
        }
        public static string getBase64FromByte(byte[] valueByte)
        {
            string base64String = Convert.ToBase64String(valueByte, 0, valueByte.Length);
            return base64String;
        }
    }
}