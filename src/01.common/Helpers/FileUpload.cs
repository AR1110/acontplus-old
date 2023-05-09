namespace Helpers
{
    public class FileUpload
    {
        public bool Upload(string _path, string fileName, byte[] content, ref string msg)
        {
            try
            {
                string path = Path.Combine(_path, fileName);
                if (File.Exists(path))
                {
                    msg = "Archivo ya existe";
                    return false;
                }
                File.WriteAllBytes(path, content);

                if (File.Exists(path))
                {
                    msg = "Archivo guardado exitosamente";
                }
                return true;
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                return false;
            }
        }
    }
}
