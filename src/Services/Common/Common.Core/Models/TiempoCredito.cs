namespace Common.Core.Models
{
    public class TiempoCredito
    {
        public int idTiempoCredito { get; set; }
        public bool gestion { get; set; }
        public string descripcion { get; set; }
        public int diasCredito { get; set; }
        public int numeroCuota { get; set; }
        public bool entrada { get; set; }
        public bool estado { get; set; }
        public bool tipo { get; set; }
    }
}
