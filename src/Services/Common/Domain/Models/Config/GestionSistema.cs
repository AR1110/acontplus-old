namespace Domain.Models.Config
{
    public class GestionSistema
    {
        public int idGestionSistema { get; set; }
        public int idEntidad { get; set; }
        public int idTipoIva { get; set; }
        public int idCliente { get; set; }
        public int idArticulo { get; set; }
        public int idMetodoValoracion { get; set; }
        public int searchCode { get; set; }
        public int printerAutomatic { get; set; }
        public int payAutomatic { get; set; }
        public string llevaInventario { get; set; }
        public string ruc { get; set; }
        public string codigoPorcentaje { get; set; }
        public string nroIdentificacion { get; set; }
        public string codMetodoValoracion { get; set; }
        public bool estado { get; set; }
    }
}
