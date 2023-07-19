namespace Domain.Models
{
    public class Sucursal
    {
        public int idSucursal { get; set; }
        public int idEntidad { get; set; }
        public string nombreComercial { get; set; }
        public string serie { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
        public string imagen { get; set; }
        public bool estado { get; set; }
    }

    public class SucursalOperacions
    {
        public Sucursal sucursal { get; set; }
        public Entidad entidad { get; set; }
        public ActividadEmpresa actividadEmpresa { get; set; }
    }
}