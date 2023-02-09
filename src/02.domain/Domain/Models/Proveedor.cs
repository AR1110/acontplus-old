using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Proveedor
    {
        public int idProveedor { get; set; }
        public int idTipoClienteProveedor { get; set; }
        public int idTipoEntidad { get; set; }
        public int idSubContribuyente { get; set; }
        public int idTiempoCredito { get; set; }
        public int idTipoIdentificacion { get; set; }
        public int idCiudad { get; set; }
        public string numeroIdentificacion { get; set; }
        public string nombreFiscal { get; set; }
        public string nombreComercial { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public bool estado { get; set; }
    }
}
