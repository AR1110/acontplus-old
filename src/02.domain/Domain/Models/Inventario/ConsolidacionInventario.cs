namespace Domain.Models.Inventario
{
    public class ConsolidacionInventario
    {
        public long idConsolidacionInventario { get; set; }
        public int idPuntoEmision { get; set; }
        public long nroDoc { get; set; }
        public string observacion { get; set; }
        public string fechaEmision { get; set; }
        public decimal total { get; set; }
        public bool anulada { get; set; }

    }
}
