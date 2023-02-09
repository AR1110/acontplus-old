
namespace Domain.Admin.Models
{
    public class Licencia
    {
        public int idLicencia {get; set;}
        public string codigo {get; set;} 
        public string titulo {get; set;} 
        public string descripcion {get; set;} 
        public decimal total {get; set;} 
        public decimal descuento {get; set;} 
        public decimal impuesto {get; set;} 
        public bool estado {get; set;} 
    }
}