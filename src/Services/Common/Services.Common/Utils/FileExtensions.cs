namespace Services.Common.Utils
{
    public static class FileExtensions
    {
        public static string GetBase64FromByte(byte[] valueByte)
        {
            string base64String = Convert.ToBase64String(valueByte, 0, valueByte.Length);
            return base64String;
        }
    }
}
