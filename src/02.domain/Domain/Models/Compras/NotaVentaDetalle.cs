using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Compras
{
    public class NotaVentaDetalle
    {
        public long idNotaVentaDetalle { get; set; }
        public long idNotaVenta { get; set; }
        public int idBodega { get; set; }
        public int idArticulo { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public string nota { get; set; }
        public decimal precioCosto { get; set; }
        public decimal precioCostoNeto { get; set; }
        public decimal descuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal valorDescuento { get; set; }
        public decimal total { get; set; }
    }
}
