namespace Domain.Dtos
{
    public class NotaCreditoDetalleXmlDto
    {
        public string codigoInterno { get; set; }
        public string codigoAdicional { get; set; }
        public string descripcion { get; set; }
        public decimal cantidad { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal descuento { get; set; }
        public decimal precioTotalSinImpuesto { get; set; }

        //Impuestos
        public decimal baseImponible { get; set; }
        public int codigo { get; set; }
        public int codigoPorcentaje { get; set; }
        public decimal tarifa { get; set; }
        public decimal valor { get; set; }

        //Detalles Adicionales
        public string unidadMedida { get; set; }
    }
}
