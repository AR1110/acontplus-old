namespace Common.Core.Models.Logistica
{
    public class GuiaRemision
    {
        public long idGuiaRemision { get; set; }
        public string codEstab { get; set; }
        public long idPuntoEmision { get; set; }
        public long idCliente { get; set; }
        public long idTransportista { get; set; }
        public long idVehiculo { get; set; }
        public long idEmpleado { get; set; }
        public string fechaEmision { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public string docAduanero { get; set; }
        public string ptoPartida { get; set; }
        public string ptoLlegada { get; set; }
        public string ruta { get; set; }
        public string estableDestino { get; set; }
        public string entregar { get; set; }
        public string motivo { get; set; }
        public string claveAcceso { get; set; }
        public bool anulada { get; set; }
        public bool autorizada { get; set; }
    }
}
