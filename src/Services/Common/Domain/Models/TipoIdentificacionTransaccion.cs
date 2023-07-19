namespace Domain.Models
{
    public class TipoIdentificacionTransaccion
    {
        public int idTipoIdentificacionTransaccion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string tipoTransaccion { get; set; }
        public int idTipoIdentificacion { get; set; }
        public string identificacion { get; set; }
        public string codigoIdentificacion { get; set; }
        public int idTipoTransaccion { get; set; }
        public string transanccion { get; set; }
        public string codigoTransanccion { get; set; }
    }
    public class TipoIdentificacionTransaccionOperaciones
    {
        public TipoIdentificacionTransaccion tipoIdentificacionTransaccion { get; set; }
        public TipoIdentificacion tipoIdentificacion { get; set; }
        public TipoTransaccion TipoTransaccion { get; set; }
    }


}
