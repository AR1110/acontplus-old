namespace Domain.Admin.Models
{
    public class Aplicacion
    {
        public int idAplicacion {get; set;}
        public int idSistema {get; set;}
        public string codigo {get; set;}
        public string codSistema {get; set;}
        public string descripcion {get; set;}
        public bool estado {get; set;}
    }
}