namespace Domain.Admin.Models
{
    public class Suscripcion
    {
        public int idSuscripcion {get; set;}
        public string codigo {get; set;}
        public string descripcion {get; set;}
        public int cantidad {get; set;}
        public string tiempo {get; set;}
        public bool estado {get;set;}
    }
}