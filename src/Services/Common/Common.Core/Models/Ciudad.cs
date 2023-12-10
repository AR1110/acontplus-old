namespace Common.Core.Models
{
    public class Ciudad
    {
        public int idCiudad { get; set; }

        public Provincia provincia { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }

    }

}