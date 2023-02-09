using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Compras
{
    public class LiquidacionCompra
    {
        public long idLiquidacionCompra { get; set; }
        public long idTipoDocumento { get; set; }
        public int idProveedor { get; set; }
        public int idPuntoEmision { get; set; }
        public int idTiempoCredito { get; set; }
        public long nroDocumento { get; set; }
        public string fechaEmision { get; set; }
        public string fechaVencimiento { get; set; }
        public decimal subTotalSinImpuestos { get; set; }
        public decimal subTotalIva { get; set; }
        public decimal subTotalNetoIva { get; set; }
        public decimal subTotalIvaCero { get; set; }
        public decimal subTotalNetoIvaCero { get; set; }
        public decimal subTotalNoObjetoIva { get; set; }
        public decimal subTotalNetoNoObjetoIva { get; set; }
        public decimal subTotalExentoIva { get; set; }
        public decimal subTotalNetoExentoIva { get; set; }
        public decimal totalDescuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal totalIce { get; set; }
        public decimal irbpnr { get; set; }
        public decimal propina { get; set; }
        public decimal iva { get; set; }
        public decimal recargo { get; set; }
        public decimal transporte { get; set; }

        public decimal tarifa { get; set; }
        public decimal total { get; set; }
        public string observacion { get; set; }
        public bool autorizada { get; set; }
        public bool anulada { get; set; }
        public string claveAcceso { get; set; }
    }
}
