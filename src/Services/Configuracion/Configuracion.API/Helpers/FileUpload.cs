namespace Configuracion.API.Helpers
{
    public class FileUpload
    {
        public async Task<bool> Upload(string _path, string fileName, byte[] content)
        {
            var path = Path.Combine(_path, fileName);
            if (File.Exists(path))
            {
                File.Delete(path);
            }
            await File.WriteAllBytesAsync(path, content);
            if (File.Exists(path))
            {
                return true;
            }
            return false;
        }
    }
}
