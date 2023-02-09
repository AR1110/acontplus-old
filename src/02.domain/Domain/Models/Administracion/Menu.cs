using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Menu
    {
        public int idMenu { get; set; }
        public string descripcion { get; set; }
        public string url { get; set; }
        public string icono { get; set; }
        public string orden { get; set; }
        public string fechaRegistro { get; set; }
        public bool estado { get; set; }
        public string grupo { get; set; } 
        public int idTipoMenu { get; set; } 
        public bool subMenu { get; set; }
    }
}