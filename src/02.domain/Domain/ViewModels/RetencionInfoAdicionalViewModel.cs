using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class RetencionInfoAdicionalViewModel
    {
        public RetencionInfoAdicional retencionInfoAdicional { get; set; }
        public List<RetencionCompraDetalleViewModel> dataDetalle { get; set; }
    }
}
