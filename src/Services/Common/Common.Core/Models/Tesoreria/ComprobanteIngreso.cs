namespace Common.Core.Models.Tesoreria
{
    public class ComprobanteIngreso
    {
        public long idComprobanteIngreso { get; set; }
        public int idCliente { get; set; }
        public string codEstab { get; set; }
        public int idCaja { get; set; }
        public int nroDocumento { get; set; }
        public decimal total { get; set; }
        public decimal abono { get; set; }
        public decimal cambio { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
    }
}
