using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Almacen
{
    public class ArticuloImagen
    {
        public int idArticuloImagen { get; set; }
        //public int idArticulo { get; set; }
        //public byte[] imagen { get; set; }
        //public string filename { get; set; }
        //public string contentType { get; set; }
        public string imagenBase64 { get; set; }
        public string mimeType { get; set; }
        public string nombreImagen { get; set; }
        //public string descripcion { get; set; }        

    }

}
