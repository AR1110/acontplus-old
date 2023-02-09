using Domain.Models.Ventas;
using System.Collections.Generic;

namespace Domain.ViewModels.Ventas
{
    public class ProformaViewModel
    {
        public Proforma proforma { get; set; }
        public List<ProformaDetalle> detalle { get; set; }
        public string nroDocumento { get; set; }
        public string nroIdentificacion { get; set; }
        public string nombreFiscal { get; set; }
        public string direccion { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public string usuario { get; set; }
    }

    public class ProformaData
    {
        public ProformaViewModel proforma { get; set; }
        public List<ProformaDetalleViewModel> detalle { get; set; }
    }

    public class ProformaSearch
    {
        public int byCliente { get; set; }
        public int byEstado { get; set; }
        public string fechaEmision { get; set; }
        public string fechaFin { get; set; }
        public int bySucursal { get; set; }
        public int byUsuario { get; set; }
    }
}
