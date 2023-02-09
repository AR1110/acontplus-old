using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models
{
    public class Impresora
    {
        public int idImpresora { get; set; }
        public string nombreImpresora { get; set; }
        public string pageWidth { get; set; }
        public string pageHeigth { get; set; }
        public string ruc { get; set; }
        public string numEstab { get; set; }
        public string ptoEmision { get; set; }
        public string estado { get; set; }
    }
}
