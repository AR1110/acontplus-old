namespace Common.Core.Models
{
    public class TipoIce
    {
        public int idTipoIce { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public decimal porcentaje { get; set; }
        public decimal valor { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int totalRecords { get; set; }
        public ActividadEmpresa actividadEmpresa { get; set; }
    }
}