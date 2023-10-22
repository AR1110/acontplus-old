namespace Domain.Models.Administracion
{
    public class AsignacionBodega
    {
        public int idAsignacionBodega { get; set; }
        public int idAsignacionSucursal { get; set; }
        public int idBodega { get; set; }
        public bool estado { get; set; }
        public bool defecto { get; set; }
    }
}
