namespace Domain.Admin.Models
{
    public class Asignacion
    {
        public int idAsignacion { get; set; }
        public int idAplicacionMenu { get; set; }
        public int idAccion { get; set; }
        public string codAplicacionMenu { get; set; }
        public string codAccion { get; set; }
        public bool estado { get; set; }
    }
}
