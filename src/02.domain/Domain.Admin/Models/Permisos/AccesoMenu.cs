namespace Domain.Admin.Models
{
    public class AccesoMenu
    {
        public int idAccesoMenu { get; set; }
        public int idUsuarioRol { get; set; }
        public int idAplicacionMenu { get; set; }
        public string codAplicacionMenu { get; set; }
        public string ruc { get; set; }
        public string nroidentificacion { get; set; }
        public bool estdao { get; set; }
    }
}
