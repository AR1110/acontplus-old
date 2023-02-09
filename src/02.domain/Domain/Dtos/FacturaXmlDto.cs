namespace Domain.Dtos
{
    public class FacturaXmlDto
    {
        public long idFactura { get; set; }
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

        //INFORMACION DE LA FACTURA
        public string fechaEmision { get; set; }
        public string dirEstablecimiento { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string tipoIdentificacionComprador { get; set; }
        public string guiaRemision { get; set; }
        public string razonSocialComprador { get; set; }
        public string identificacionComprador { get; set; }
        public string direccionComprador { get; set; }
        public decimal totalSinImpuestos { get; set; }
        public decimal totalDescuento { get; set; }
        public decimal propina { get; set; }
        public decimal importeTotal { get; set; }
        public string moneda { get; set; }
        public string actividad { get; set; }
        public string placa { get; set; }
        //INFO ADICIONAL
        public string telefono { get; set; }
        public string email { get; set; }
        public string periodoFiscal { get; set; }
        public string contribuyente { get; set; }
    }
}
