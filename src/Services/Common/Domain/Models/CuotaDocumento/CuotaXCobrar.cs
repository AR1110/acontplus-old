namespace Domain.Models.CuotaDocumento
{

    public class CuotaXCobrar
    {
        public long idCuotaXCobrar { get; set; }
        public long idTipoDocumento { get; set; }
        public long idComprobante { get; set; }
        public int idEstadoPago { get; set; }
        public string fechaVencimiento { get; set; }
        public int nroCuota { get; set; }
        public decimal cuota { get; set; }
        public bool entrada { get; set; }
        public decimal interes { get; set; }
        public int diasMora { get; set; }
        public bool estado { get; set; }
    }

}
