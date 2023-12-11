namespace Common.Core.Models.Administracion
{
    public class AsignacionPuntoEmision
    {
        public int idAsignacionPuntoEmision { get; set; }
        public int idAsignacionSucursal { get; set; }
        public int idPuntoEmision { get; set; }
        public bool defecto { get; set; }
        public bool estado { get; set; }
    }
}
