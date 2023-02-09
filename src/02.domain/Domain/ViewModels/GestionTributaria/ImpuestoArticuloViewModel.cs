using Domain.Models.GestionTributaria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.GestionTributaria
{
    public class ImpuestoArticuloViewModel
    {
        public ImpuestoArticulo impuestoArticulo { get; set; }
        public string subContribuyente { get; set; }
        public string nombreRetencionRenta { get; set; }
        public long idTipoImpuestoRenta { get; set; }
        public string nombreTipoRenta { get; set; }
        public long idTipoContribuyente { get; set; }
        public string nombreTipoContribuyente { get; set; }
    }
}
