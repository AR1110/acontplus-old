namespace Domain.Dtos
{
    public class NotaCreditoImpuestoXmlDto
    {
        public int codigo { get; set; }
        public int codigoPorcentaje { get; set; }
        public decimal baseImponible { get; set; }
        public decimal valor { get; set; }
    }
}
