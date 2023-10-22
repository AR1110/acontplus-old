namespace Domain.Models.Compras
{
    public class CategoriaCompra
    {

        public int idCategoriaCompra { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int totalRecords { get; set; }
    }
}
