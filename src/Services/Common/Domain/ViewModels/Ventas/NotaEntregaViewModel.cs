using Domain.Models.Ventas;

namespace Domain.ViewModels.Ventas
{
    public class NotaEntregaViewModel
    {
        public NotaEntrega notaEntrega { get; set; }
        public List<NotaEntregaDetalle> detalle { get; set; }
        //  public List<ManejoArticulo> manejoArticulo { get; set; }
        public string infoAdicionalArticulo { get; set; }
        public int totalRecords { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string estadoFinanciero { get; set; }
        public bool gestion { get; set; }
        public bool cobro { get; set; }
        public string nroIdentificacion { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public decimal posfechado { get; set; }
        public string style { get; set; }
        public string usuario { get; set; }
    }

    public class NotaEntregaSearch
    {
        public int byCliente { get; set; }
        public int byEstado { get; set; }
        public int byUsuario { get; set; }
        public string fechaEmision { get; set; }
        public string fechaFin { get; set; }
        public string fechaVencimiento { get; set; }
        public int bySucursal { get; set; }
    }
    public class NotaEntregaData
    {
        public NotaEntregaViewModel notaEntrega { get; set; }
        public List<NotaEntregaDetalleViewModel> detalle { get; set; }
    }
}
