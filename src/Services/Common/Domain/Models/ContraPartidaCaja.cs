namespace Domain.Models
{
    public class ContraPartidaCaja
    {
        public int idContraPartidaCaja { get; set; }
        public int idContraPartida { get; set; }
        public int idCaja { get; set; }
        public bool estado { get; set; }
    }
}
