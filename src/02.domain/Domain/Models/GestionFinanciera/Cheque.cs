using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.GestionFinanciera
{
    public class Cheque
    {
        public long id { get; set; }
        public int gestion { get; set; }
        public decimal valor { get; set; }
        public string nro { get; set; }
        public string fechaEmision { get; set; }
        public string banco { get; set; }
        public string tipoCheque { get; set; }
        public string color { get; set; }
        public string persona { get; set; }
        public string estado { get; set; }
    }

    public class ChequeSearch
    {
        public int byClase { get; set; }
        public string byPersona { get; set; }
        public int byTipo { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }

    }
}
