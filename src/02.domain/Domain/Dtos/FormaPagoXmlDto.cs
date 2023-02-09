namespace Domain.Dtos
{
    public class FormaPagoXmlDto
    {
        public string formaPago { get; set; }
        public decimal total { get; set; }
        public int plazo { get; set; }
        public string unidadTiempo { get; set; }
    }
}
