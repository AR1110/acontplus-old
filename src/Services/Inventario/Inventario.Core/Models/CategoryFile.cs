using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Core.Models
{
    public class CategoryFile
    {
        public IFormFile DataFile { get; set; }
        public string Params { get; set; }
    }
}
