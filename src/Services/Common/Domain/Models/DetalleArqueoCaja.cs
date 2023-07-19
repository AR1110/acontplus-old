namespace Domain.Models
{
    public class DetalleArqueoCaja
    {
        public int idDetalleArqueoCaja { get; set; }
        public int idControlCaja { get; set; }
        public int idMoneda { get; set; }
        public int cantidad { get; set; }
        public decimal total { get; set; }
    }
}
