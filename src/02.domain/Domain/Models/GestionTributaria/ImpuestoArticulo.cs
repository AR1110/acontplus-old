using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.GestionTributaria
{
    public class ImpuestoArticulo
    {
        public long idImpuestoArticulo { get; set; }
        public long idArticulo { get; set; }
        public long idSubContribuyente { get; set; }
        public long idRetencionRenta { get; set; }

    }
}
