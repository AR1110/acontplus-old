using System.Collections.Generic;
using System.Xml;

namespace Domain.Models.FE
{
    public class ComprobanteElectronicoXml
    {
        public InfoTributaria infoTributaria { get; set; }
        public InfoComprobante infoComprobante { get; set; }
        public List<TotalImpuesto> totalImpuestos { get; set; }
        public List<Pago> pagos { get; set; }
        public List<Detalle> detalles { get; set; }
        public List<ImpuestoComp> impuestos { get; set; }
        public List<InfoAdicional> infoAdicionals { get; set; }
    }
    public class InfoTributaria
    {
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

    }
    public class InfoComprobante
    {
        public string fechaEmision { get; set; }
        public string dirEstablecimiento { get; set; }

        public string contribuyenteEspecial { get; set; }

        public string obligadoContabilidad { get; set; }

        public string tipoIdentificacionComprador { get; set; }
        public string razonSocialComprador { get; set; }

        public string identificacionComprador { get; set; }

        public string guiaRemision { get; set; }
        public string totalSinImpuestos { get; set; }
        public string totalDescuento { get; set; }
        public string propina { get; set; }
        public string importeTotal { get; set; }
        public string moneda { get; set; }
    }
    public class TotalImpuesto
    {
        public string codigo { get; set; }
        public string codigoPorcentaje { get; set; }
        public string descuentoAdicional { get; set; }
        public string baseImponible { get; set; }
        public string valor { get; set; }
    }
    public class Pago
    {
        public string formaPago { get; set; }
        public string total { get; set; }
        public string plazo { get; set; }
        public string unidadTiempo { get; set; }
    }
    public class Detalle
    {
        public string codigoPrincipal { get; set; }
        public string codigoAuxiliar { get; set; }
        public string descripcion { get; set; }
        public string cantidad { get; set; }
        public string precioUnitario { get; set; }
        public string descuento { get; set; }
        public string precioTotalSinImpuesto { get; set; }
        public string detAdicionalNombre { get; set; }
        public string detAdicionalValor { get; set; }
    }
    public class DetalleFactura
    {
        public int idProveedor { get; set; }
        public int idArticulo { get; set; }
        public int idMedida { get; set; }
        public string codigoPrincipal { get; set; }
        public string codigoAuxiliar { get; set; }
        public string descripcion { get; set; }
        public string cantidad { get; set; }
        public string precioUnitario { get; set; }
        public string descuento { get; set; }
        public string precioTotalSinImpuesto { get; set; }
        public string detAdicionalNombre { get; set; }
        public string detAdicionalValor { get; set; }
    }
    public class ImpuestoComp
    {
        public string codArticulo { get; set; }
        public string codigo { get; set; }
        public string codigoPorcentaje { get; set; }
        public string tarifa { get; set; }
        public string baseImponible { get; set; }
        public string valor { get; set; }
    }
    public class InfoAdicional
    {
        public string nombre { get; set; }
        public string valor { get; set; }
    }
}
