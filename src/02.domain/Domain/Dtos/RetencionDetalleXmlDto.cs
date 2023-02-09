namespace Domain.Dtos
{
    public class RetencionDetalleXmlDto
    {
        public string codigo { get; set; }
        public string codigoRetencion { get; set; }
        public decimal baseImponible { get; set; }
        public decimal porcentajeRetener { get; set; }
        public decimal valorRetenido { get; set; }
        public string codDocSustento { get; set; }
        public string numDocSustento { get; set; }
        public string fechaEmisionDocSustento { get; set; }
    }
}
