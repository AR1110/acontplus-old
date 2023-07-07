namespace Domain.Models
{
    public class Empleado
    {
        public int idEmpleado { get; set; }
        public int idTipoIdentificacion { get; set; }
        public string nroIdentificacion { get; set; }
        public string nombreCompleto { get; set; }
        public bool estado { get; set; }
    }
}
