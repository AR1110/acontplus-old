namespace Domain.Models.Sri
{
    public class EstablecimientoSri
    {
        public int idEstablecimiento { get; set; }
        public string codigo { get; set; }
        public string canton { get; set; }
        public string actividad { get; set; }
        public string agenteRetencion { get; set; }
        public string contribuyente { get; set; }
        public string ruc { get; set; }
        public string estab { get; set; }
        public string contribuyenteEspecial { get; set; }
        public string obligadoContabilidad { get; set; }
        public string nombreComercial { get; set; }
        public string dirEstablecimiento { get; set; }
        public string contribuyenteRimpe { get; set; }
        public bool estado { get; set; }
    }

    public class EstablecimientoParams
    {
        public string json { get; set; }
    }
}
