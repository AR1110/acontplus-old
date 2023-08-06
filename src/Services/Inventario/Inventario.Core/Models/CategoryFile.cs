using Microsoft.AspNetCore.Http;

namespace Inventario.Core.Models
{
    public class CategoryFile
    {
        public IFormFile DataFile { get; set; }
        public string Params { get; set; }
    }
}
