namespace Domain.Models.Almacen
{
    public class SubFamilia
    {
        public int idSubFamilia { get; set; }
        public int idFamilia { get; set; }
        public string descripcion { get; set; }
        public string siglas { get; set; }
        public string codigo { get; set; }
        public int ultimoSecuencial { get; set; }
        public bool estado { get; set; }
        public decimal montoObjetivo { get; set; }
        public string S3ObjectKey { get; set; }
        public string S3ObjectUrl { get; set;}
    }
}
