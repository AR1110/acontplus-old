namespace Common.Core.Models.Ventas
{
    public class RetencionVenta
    {
        public long idRetencionVenta { get; set; }
        public long idFactura { get; set; }
        public long idCliente { get; set; }
        public string codEstab { get; set; }
        public string ptoEmision { get; set; }
        public long nroDoc { get; set; }
        public string fechaEmision { get; set; }
        public string nroAutho { get; set; }
        public string concepto { get; set; }
        public decimal total { get; set; }
        public bool estado { get; set; }

    }
}
