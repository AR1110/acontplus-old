namespace ApiProveedores.Utils
{
    public static class FileData
    {
        public static byte[] GetFileByte(IFormFile file)
        {
            byte[] fileBytes = null;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileBytes = ms.ToArray();
            }
            return fileBytes;
        }
        public static bool SaveFile(string path, IFormFile file)
        {
            bool result;
            try
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                string filePath = Path.Combine(path, file.FileName);
                using (var stream = File.Create(filePath))
                {
                    file.CopyTo(stream);
                }
                result = true;
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                result = false;
            }
            return result;
        }
    }
}
