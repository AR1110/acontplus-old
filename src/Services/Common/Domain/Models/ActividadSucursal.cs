namespace Domain.Models
{
    public class ActividadSucursal
    {
        public int idActividadSucursal { get; set; }
        public int idSucursal { get; set; }
        public int idActividadEmpresa { get; set; }
        public bool estado { get; set; }
    }
}
