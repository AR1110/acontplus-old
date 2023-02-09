using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models
{
    public class LogoSucursal
    {
        public int idLogoSucursal { get; set; }
        public int idSucursal { get; set; }
        public string sucursal { get; set; }
        public byte[] imagen { get; set; }
        public string mimeType { get; set; }
        public string nombreImagen { get; set; }
        public bool estado { get; set; }
    }
}
