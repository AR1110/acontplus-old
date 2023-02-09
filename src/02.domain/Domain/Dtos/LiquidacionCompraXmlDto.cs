using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dtos
{
    public class LiquidacionCompraXmlDto
    {
        public long idLiquidacionCompra { get; set; }
        public string fileName { get; set; }
        //INFORMACION TRIBUTARIA
        public string ambiente { get; set; }
        public string tipoEmision { get; set; }
        public string razonSocial { get; set; }
        public string nombreComercial { get; set; }
        public string ruc { get; set; }
        public string claveAcceso { get; set; }
        public string codDoc { get; set; }
        public string estab { get; set; }
        public string ptoEmi { get; set; }
        public string secuencial { get; set; }
        public string dirMatriz { get; set; }

        //INFORMACION DE LA LIQUIDACION DE COMPRA
        public string fechaEmision { get; set; }
        public string dirEstablecimiento { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string tipoIdentificacionProveedor { get; set; }
        public string razonSocialProveedor { get; set; }
        public string identificacionProveedor { get; set; }
        public string direccionProveedor { get; set; }
        public decimal totalSinImpuestos { get; set; }
        public decimal totalDescuento { get; set; }
        public decimal importeTotal { get; set; }
        public string moneda { get; set; }

        //INFO ADICIONAL
        public string telefono { get; set; }
        public string email { get; set; }
        public string periodoFiscal { get; set; }
        public string contribuyente { get; set; }
    }
}
