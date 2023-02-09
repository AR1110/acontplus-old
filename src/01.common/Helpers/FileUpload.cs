using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helpers
{
    public class FileUpload
    {
        private IConfiguration _configuration;
        private readonly string _path = "";

        public FileUpload(IConfiguration configuration)
        {
            _configuration = configuration;
            _path = _configuration.GetSection("FactElectCerts").Value;
        }


        public bool Upload(string fileName, byte[] content, ref string msg)
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
