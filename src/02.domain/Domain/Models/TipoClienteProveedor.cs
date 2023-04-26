namespace Domain.Models
{
    public class TipoClienteProveedor
    {
        public int idTipoClienteProveedor { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public bool tipoClienteProveedor { get; set; }
        public int totalRecords { get; set; }
        public TipoPersona tipoPersona { get; set; }

    }
}