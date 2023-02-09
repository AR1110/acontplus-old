namespace Domain.Dtos
{
    public class NotaCreditoXmlDto
    {
        public long idNotaCredito { get; set; }
        public string fileName { get; set; }

        //xml
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
        public string fechaEmision { get; set; }
        public string dirEstablecimiento { get; set; }
        public string tipoIdentificacionComprador { get; set; }
        public string razonSocialComprador { get; set; }
        public string identificacionComprador { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string rise { get; set; }
        public string codDocModificado { get; set; }
        public string numDocModificado { get; set; }
        public string fechaEmisionDocSustento { get; set; }
        public decimal totalSinImpuestos { get; set; }
        public decimal valorModificacion { get; set; }
        public string moneda { get; set; }
        public string motivo { get; set; }
        //INFO ADICIONAL
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
    }
}
