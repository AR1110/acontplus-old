using Domain.Models.Inventario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Inventario
{
    public class TransferenciaBodegaViewModel
    {
        public TransferenciaBodega transferencia { get; set; }
        public List<TransferenciaBodegaDetalle> detalle { get; set; }
    }
}
