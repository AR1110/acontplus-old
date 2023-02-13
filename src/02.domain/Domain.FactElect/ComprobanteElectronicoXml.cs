namespace Domain.FactElect
{
    public class ComprobanteElectronicoXml
    {
        public string codDoc { get; set; }
        public InfoTributaria infoTributaria { get; set; }
        protected InfoFactura infoFactura { get; set; }
        protected InfoCompRetencion infoCompRetencion { get; set; }
        protected List<TotalImpuesto> totalImpuestos { get; set; }
        protected List<Pago> pagos { get; set; }
        protected List<Detalle> detalles { get; set; }
        protected List<Impuesto> impuestos { get; set; }
        protected List<ImpuestoRetencion> impuestosRetencion { get; set; }
        protected List<InfoAdicional> infoAdicional { get; set; }

        public void Create(string codDoc, object obj)
        {
            switch (codDoc)
            {
                case "01":
                    this.infoFactura = obj as InfoFactura;
                    break;
                case "03":
                    break;
                case "04":
                    break;
                case "05":
                    break;
                case "06":
                    break;
                case "07":
                    this.infoCompRetencion = obj as InfoCompRetencion;
                    break;
                default:
                    break;
            }
        }
        public void CreateTotalTaxes(object obj)
        {
            this.totalImpuestos = obj as List<TotalImpuesto>;
        }
        public void CreatePayments(object obj)
        {
            this.pagos = obj as List<Pago>;
        }
        public void CreateDetails(object obj)
        {
            this.detalles = obj as List<Detalle>;
        }
        public void CreateTaxes(object obj)
        {
            this.impuestos = obj as List<Impuesto>;
        }
        public void CreateRetencionTaxes(object obj)
        {
            this.impuestosRetencion = obj as List<ImpuestoRetencion>;
        }
        public void CreateAdditionalInfo(object obj)
        {
            this.infoAdicional = obj as List<InfoAdicional>;
        }
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
    public class InfoFactura
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
    public class InfoCompRetencion
    {
        public string fechaEmision { get; set; }
        public string dirEstablecimiento { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string tipoIdentificacionSujetoRetenido { get; set; }
        public string razonSocialSujetoRetenido { get; set; }
        public string identificacionSujetoRetenido { get; set; }
        public string periodoFiscal { get; set; }
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
    public class Impuesto
    {
        public string codArticulo { get; set; }
        public string codigo { get; set; }
        public string codigoPorcentaje { get; set; }
        public string tarifa { get; set; }
        public string baseImponible { get; set; }
        public string valor { get; set; }
    }
    public class ImpuestoRetencion
    {
        public string codigo { get; set; }
        public string codigoRetencion { get; set; }
        public string baseImponible { get; set; }
        public string porcentajeRetener { get; set; }
        public string valorRetenido { get; set; }
        public string codDocSustento { get; set; }
        public string numDocSustento { get; set; }
        public string fechaEmisionDocSustento { get; set; }
    }
    public class InfoAdicional
    {
        public string nombre { get; set; }
        public string valor { get; set; }
    }
}
