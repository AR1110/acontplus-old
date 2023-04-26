namespace Domain.Models
{
    public class AsignacionUsuario
    {
        public int idAsignacionPuntoEmision { get; set; }
        public int idAsignacionBodega { get; set; }
        public Rol rol { get; set; }
        public Bodega bodega { get; set; }
        public PtoEmision puntoEmision { get; set; }
        public Sucursal sucursal { get; set; }
        public Entidad entidad { get; set; }
        public bool predeterminado { get; set; }
        public bool estado { get; set; }
    }
}
