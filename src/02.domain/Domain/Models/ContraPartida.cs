using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ContraPartida
    {
        public int idContraPartida { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public string observacion { get; set; }
        public bool estado { get; set; }
        public List<ContraPartidaCajaViewModel> dataCaja { get; set; }
        public List<ContraPartidaEntidadFinancieraViewModel> dataEntidadFinanciera { get; set; }
    }
}
