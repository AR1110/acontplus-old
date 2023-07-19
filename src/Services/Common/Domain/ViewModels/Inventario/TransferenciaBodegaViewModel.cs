using Domain.Models.Inventario;

namespace Domain.ViewModels.Inventario
{
    public class TransferenciaBodegaViewModel
    {
        public TransferenciaBodega transferencia { get; set; }
        public List<TransferenciaBodegaDetalle> detalle { get; set; }
    }
}
