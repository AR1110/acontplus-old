using Domain.Models.Compras;

namespace Domain.ViewModels.Compras
{
    public class IngresoBodegaViewModel
    {
        public IngresoBodega ingresoBodega { get; set; }
        public List<IngresoBodegaDetalle> detalle { get; set; }
        public List<ManejoArticuloDetalleViewModel> manejoArticuloDetalle { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public string nroIdentificacion { get; set; }
        public string nombreFiscal { get; set; }
        public string nroDocumento { get; set; }
        public string estadoFinanciero { get; set; }
        public string style { get; set; }
        public bool gestion { get; set; }
        public bool pago { get; set; }
        public string usuario { get; set; }
    }

    public class IngresoBodegaData
    {
        public IngresoBodegaViewModel ingresoBodega { get; set; }
        public List<IngresoBodegaDetalleViewModel> detalle { get; set; }
        public List<ManejoArticuloDetalleViewModel> adicional { get; set; }
    }
}
