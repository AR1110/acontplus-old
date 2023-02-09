using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models.Almacen
{
    public class Familia
    {
        public int idFamilia { get; set; }
        public string descripcion { get; set; }
        public string siglas { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
    }
}