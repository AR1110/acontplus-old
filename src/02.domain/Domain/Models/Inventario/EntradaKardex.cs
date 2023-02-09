namespace Domain.Models.Inventario
{
    public class EntradaKardex
    {
        public long idEntradaKardex { get; set; }
        public long idTipoDocumento { get; set; }
        public long idComprobante { get; set; }
        public bool tipoTransaccion { get; set; }
        public bool estado { get; set; }
    }
}
