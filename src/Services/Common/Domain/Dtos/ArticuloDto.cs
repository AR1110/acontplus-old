namespace Domain.Dtos
{
    public class ArticuloDto
    {
        public string proveedor { get; set; }
        public decimal precioCosto { get; set; }
        public string numeroFactura { get; set; }
        public string fechaEmision { get; set; }
        public decimal cantidad { get; set; }
        public decimal total { get; set; }
        public string tipoDocumento { get; set; }

    }
}
