namespace Domain.Models
{
    public class AsignacionSucursal
    {
        public int idAsignacionSucursal { get; set; }
        public int idUsuarioRol { get; set; }
        public int idSucursal { get; set; }
        public bool defecto { get; set; }
        public bool estado { get; set; }
    }
}
