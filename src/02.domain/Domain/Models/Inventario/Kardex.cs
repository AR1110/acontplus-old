namespace Domain.Models.Inventario
{
    public class Kardex
    {
        public int idComprobante { get; set; }

        public int idArticulo { get; set; }
        public int idBodega { get; set; }
        public string codigo { get; set; }
    }
    public class Totales
    {
        public decimal cantTotalEntrada { get; set; }
        public decimal totalEntrada { get; set; }
        public decimal cantTotalSalida { get; set; }
        public decimal totalSalida { get; set; }
        public decimal stock { get; set; }

    }

}
