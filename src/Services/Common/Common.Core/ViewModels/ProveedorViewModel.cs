using Common.Core.Models;

namespace Common.Core.ViewModels
{
    public class ProveedorViewModel
    {
        public Proveedor proveedor { get; set; }
        public string tipoClienteProveedor { get; set; }
        public string tipoEntidad { get; set; }
        public string subContribuyente { get; set; }
        public string tiempoCredito { get; set; }
        public string tipoIdentificacion { get; set; }
        public string ciudad { get; set; }
        public string provincia { get; set; }
        public int diasCredito { get; set; }
        public string codigoIndetificacion { get; set; }
        public string telefono { get; set; }
        public int totalRecords { get; set; }
    }
}
