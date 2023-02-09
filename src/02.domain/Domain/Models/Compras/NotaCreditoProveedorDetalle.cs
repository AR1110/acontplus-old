using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Compras
{
    public class NotaCreditoProveedorDetalle
    {
        public long idNotaCreditoProveedorDetalle { get; set; }
        public long idNotaCreditoProveedor { get; set; }
        public int idBodega { get; set; }
        public int idArticulo { get; set; }
        public long idTipoIva { get; set; }
        public long idMedida { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public string nota { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal precioCostoNeto { get; set; }
        public decimal descuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal valorDescuento { get; set; }
        public decimal ice { get; set; }
        public decimal total { get; set; }
    }
}
