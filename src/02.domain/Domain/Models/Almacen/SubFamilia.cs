using Domain.Models.Almacen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models.Almacen
{
    public class SubFamilia
    {
        public int idSubFamilia { get; set; }
        public int idFamilia { get; set; }
        public string descripcion { get; set; }
        public string siglas { get; set; }
        public string codigo { get; set; }
        public int ultimoSecuencial { get; set; }
        public bool estado { get; set; }
        public decimal montoObjetivo { get; set; }

    }
}