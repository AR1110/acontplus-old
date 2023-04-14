namespace Domain.Dtos
{
    public class CCedulaSriDto
    {
        public string identificacion { get; set; }
        public string nombreCompleto { get; set; }
        public object fechaDefuncion { get; set; }
        public string Error { get; set; }
    }
    public class CaptchaImage
    {
        public string imageName { get; set; }
        public string imageFieldName { get; set; }
        public List<string> values { get; set; }
        public string audioFieldName { get; set; }
    }
    public class DtoCedula
    {

        public string Cedula { get; set; }

    }
    public class RUCSriDTo
    {

        public string Ruc { get; set; }

    }

    public class Token
    {
        public string mensaje { get; set; }
    }
    public class CDTo
    {
        

        
       

        //public class Establecimiento
        //{
        //    public object nombreFantasiaComercial { get; set; }
        //    public string tipoEstablecimiento { get; set; }
        //    public string direccionCompleta { get; set; }
        //    public string estado { get; set; }
        //    public string numeroEstablecimiento { get; set; }
        //    public string matriz { get; set; }
        //}

        //public class InformacionFechasContribuyente
        //{
        //    public string fechaInicioActividades { get; set; }
        //    public string fechaCese { get; set; }
        //    public string fechaReinicioActividades { get; set; }
        //    public string fechaActualizacion { get; set; }
        //}

        //public class RepresentantesLegales
        //{
        //    public string identificacion { get; set; }
        //    public string nombre { get; set; }
        //}



        //public class DatosPersonaSriUpdate
        //{
        //    public string Error { get; set; }
        //    public string numeroRuc { get; set; }
        //    public string razonSocial { get; set; }
        //    public string estadoContribuyenteRuc { get; set; }
        //    public string actividadEconomicaPrincipal { get; set; }
        //    public string tipoContribuyente { get; set; }
        //    public string regimen { get; set; }
        //    public string categoria { get; set; }
        //    public string obligadoLlevarContabilidad { get; set; }
        //    public string agenteRetencion { get; set; }
        //    public string contribuyenteEspecial { get; set; }
        //    public InformacionFechasContribuyente informacionFechasContribuyente { get; set; }
        //    public object representantesLegales { get; set; }
        //    public object motivoCancelacionSuspension { get; set; }
        //    public string contribuyenteFantasma { get; set; }
        //    public string transaccionesInexistente { get; set; }
        //    public List<Establecimiento> Establecimientos { get; set; }
        //}
    }
}
