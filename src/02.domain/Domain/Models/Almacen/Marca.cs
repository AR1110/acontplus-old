using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class Marca
    {
        public int? idMarca { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public string fechaBaja { get; set; }
        public int totalRecords { get; set; }
    }
}