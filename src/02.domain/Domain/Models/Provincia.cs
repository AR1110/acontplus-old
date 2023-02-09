using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Provincia
    {
        public int idProvincia { set; get; }
        public string descripcion { set; get; }
        public string codigo { set; get; }
        public bool estado { set; get; }
    }
}