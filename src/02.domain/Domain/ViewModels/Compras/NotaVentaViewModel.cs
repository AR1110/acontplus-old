using Domain.Models.Compras;
using System.Collections.Generic;

namespace Domain.ViewModels.Compras
{
    public class NotaVentaViewModel
    {
        public NotaVenta notaVenta { get; set; }
        public List<NotaVentaDetalle> detalle { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string nroIdentificacion { get; set; }
        public string correo { get; set; }
        public string direccion { get; set; }
        public string estadoFinanciero { get; set; }
    }
    public class NotaVentaData
    {
        public NotaVentaViewModel notaVenta { get; set; }
        public List<NotaVentaDetalleViewModel> detalle { get; set; }
    }
}
