using Domain.Models;
using Domain.Models.Compras;
using Domain.Models.InfoAdicional;
using Domain.ViewModels.InfoAdicional;

namespace Domain.ViewModels
{
    public class FacturaViewModel
    {
        public Factura factura { get; set; }
        public List<FacturaDetalle> detalle { get; set; }
        public List<InfoAdicionalDoc> adicional { get; set; }
        public List<ManejoArticulo> manejoArticulo { get; set; }
        public string nroFactura { get; set; }
        public string nroRetencion { get; set; }
        public string nroGuiaRemision { get; set; }
        public string nroNotaCredito { get; set; }
        public string nombreFiscal { get; set; }
        public string estadoSri { get; set; }
        public string estadoFinanciero { get; set; }
        public string nroIdentificacion { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public bool gestion { get; set; }
        public bool gestionFinanciera { get; set; }
        public bool gestionTributaria { get; set; }
        public string claveAcceso { get; set; }
        public bool credito { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public decimal posfechado { get; set; }
        public string style { get; set; }
        public string usuario { get; set; }
    }

    public class FacturaParams
    {
        public string factura { get; set; }
        public string detalle { get; set; }
        public string adicional { get; set; }
        public string infoAdicionalArticulo { get; set; }
    }

    public class FacturaData
    {
        public FacturaViewModel factura { get; set; }
        public List<FacturaDetalleViewModel> detalle { get; set; }
        public List<InfoAdicionalDocViewModel> infoAdicional { get; set; }
    }

    public class FacturaSearch
    {
        public int byCliente { get; set; }
        public int byEstado { get; set; }
        public int byUsuario { get; set; }
        public string fechaEmision { get; set; }
        public string fechaFin { get; set; }
        public string fechaVencimiento { get; set; }
        public int bySucursal { get; set; }
    }
}
