namespace Domain.Models.Inventario
{
    public class SalidaKardex
    {
        public long idSalidaKardex { get; set; }
        public long idTipoDocumento { get; set; }
        public long idComprobante { get; set; }
        public bool tipoTransaccion { get; set; }
        public bool estado { get; set; }
    }
}
