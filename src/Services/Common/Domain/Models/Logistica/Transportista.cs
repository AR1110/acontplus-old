namespace Domain.Models.Logistica
{
    public class Transportista
    {
        public int idTransportista { get; set; }
        public int idTipoIdentificacion { get; set; }
        public string nroIdentificacion { get; set; }
        public string nombre { get; set; }
        public bool estado { get; set; }
    }
}
