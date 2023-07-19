namespace Domain.Models
{
    public class ContraPartidaEntidadFinanciera
    {
        public int idContraPartidaEntidadFinanciera { get; set; }
        public int idContraPartida { get; set; }
        public int idEntidadFinanciera { get; set; }
        public bool estado { get; set; }
    }
}
