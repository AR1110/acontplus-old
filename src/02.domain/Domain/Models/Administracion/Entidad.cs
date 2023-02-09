
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{

    public class Entidad
    {
        public int idEntidad { get; set; }
        public int idCiudad { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public string nombreComercial { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
        public string imagen { get; set; }
        public bool estado { get; set; }
    }

}