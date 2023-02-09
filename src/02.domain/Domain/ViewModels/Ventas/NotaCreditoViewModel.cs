using Domain.Models.InfoAdicional;
using Domain.Models.Ventas;
using System.Collections.Generic;

namespace Domain.ViewModels.Ventas
{
    public class NotaCreditoViewModel
    {
        public NotaCredito nota { get; set; }
        public List<NotaCreditoDetalle> detalle { get; set; }
        public List<InfoAdicionalDoc> adicional { get; set; }
        public string nroDocumento { get; set; }
        public string nombreFiscal { get; set; }
        public string estadoSri { get; set; }
        public bool gestion { get; set; }
        public string nroIdentificacion { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public string nroFactura { get; set; }
        public string style { get; set; }
    }

    public class NotaCreditoData
    {
        public NotaCreditoViewModel nota { get; set; }
        public List<NotaCreditoDetalleViewModel> detalle { get; set; }
        public List<InfoAdicionalDoc> infoAdicional { get; set; }
    }
}
