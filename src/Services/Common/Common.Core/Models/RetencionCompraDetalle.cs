namespace Common.Core.Models
{
    public class RetencionCompraDetalle
    {
        public long idRetencionCompraDetalle { get; set; }
        public long idRetencionCompra { get; set; }
        public int idImpuesto { get; set; }
        public int idRetencion { get; set; }
        public decimal baseImponible { get; set; }
        public decimal porcentajeRetencion { get; set; }
        public decimal valorRetenido { get; set; }


    }

}
