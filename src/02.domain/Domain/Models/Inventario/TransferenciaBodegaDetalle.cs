using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Inventario
{
    public class TransferenciaBodegaDetalle
    {
        public long idTransferenciaBodegaDetalle { get; set; }
        public long idTransferenciaBodega { get; set; }
        public long idArticulo { get; set; }
        public long idMedida { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public decimal precioCosto { get; set; }
        public decimal total { get; set; }
        public bool estado { get; set; }
    }
}
