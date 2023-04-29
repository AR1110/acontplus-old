namespace Domain.Models
{
    public class TipoDocumento
    {
        public int idTipoDocumento { get; set; }
        public string descripcion { get; set; }
        public TipoTransaccion tipoTransaccion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
    }
}
