namespace Domain.Dtos
{
    public class RetencionXmlDto
    {
        public long idRetencion { get; set; }
        public string fileName { get; set; }

        //XML
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
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string tipoIdentificacionSujetoRetenido { get; set; }
        public string razonSocialSujetoRetenido { get; set; }
        public string identificacionSujetoRetenido { get; set; }
        public string periodoFiscal { get; set; }
        public string direccionProveedor { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
    }
}
