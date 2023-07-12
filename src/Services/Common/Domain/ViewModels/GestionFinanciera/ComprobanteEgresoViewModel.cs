using Domain.Models.GestionFinanciera;

namespace Domain.ViewModels.GestionFinanciera
{
    public class ComprobanteEgresoViewModel
    {
        public ComprobanteEgreso comprobanteEgreso { get; set; }
        public List<Pago> pagos { get; set; }
        public List<PagoDetalleViewModel> pagoDetalle { get; set; }
        public string nroDocumento { get; set; }
        public string proveedor { get; set; }
        public string nroIdentificacion { get; set; }
        public string caja { get; set; }
        public string color { get; set; }
        public string estado { get; set; }
    }
}
