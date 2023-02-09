namespace Domain.Dtos
{
    public class GuiaRemisionXmlDto
    {
        public long idGuiaRemision { get; set; }
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
        public string dirEstablecimiento { get; set; }
        public string dirPartida { get; set; }
        public string razonSocialTransportista { get; set; }
        public string tipoIdentificacionTransportista { get; set; }
        public string rucTransportista { get; set; }
        public string rise { get; set; }
        public string obligadoContabilidad { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string fechaIniTransporte { get; set; }
        public string fechaFinTransporte { get; set; }
        public string placa { get; set; }
        public string identificacionDestinatario { get; set; }
        public string razonSocialDestinatario { get; set; }
        public string dirDestinatario { get; set; }
        public string motivoTraslado { get; set; }
        public string docAduaneroUnico { get; set; }
        public string codEstabDestino { get; set; }
        public string ruta { get; set; }
        public string codDocSustento { get; set; }
        public string nroDocSustento { get; set; }
        public string numDocSustento { get; set; }
        public string numAutDocSustento { get; set; }
        public string fechaEmisionDocSustento { get; set; }

        //CAMPOS ADICIONALES
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
        public string sucursal { get; set; }

    }
}
