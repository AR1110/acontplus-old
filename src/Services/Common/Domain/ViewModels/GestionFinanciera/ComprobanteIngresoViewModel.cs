using Domain.Models.Tesoreria;

namespace Domain.ViewModels.Tesoreria
{
    public class ComprobanteIngresoViewModel
    {
        public ComprobanteIngreso comprobanteIngreso { get; set; }
        public List<Cobro> cobros { get; set; }
        public List<CobroDetalleViewModel> cobroDetalles { get; set; }
        public string cliente { get; set; }
        public string caja { get; set; }
        public string nroDocumento { get; set; }
        public string nroIdentificacion { get; set; }
        public string estado { get; set; }
        public string color { get; set; }
    }
}
