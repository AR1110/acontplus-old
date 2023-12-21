namespace Common.Core.Models.Administracion
{
    public class ControlCaja
    {
        public int idControlCaja { get; set; }
        public int idCaja { get; set; }
        public int idEntidadFinanciera { get; set; }
        public string fechaApertura { get; set; }
        public string fechaCierre { get; set; }
        public bool estado { get; set; }
        public decimal entrada { get; set; }
        public decimal faltante { get; set; }
        public decimal sobrante { get; set; }
        public decimal totalArqueo { get; set; }
        public decimal totalSistema { get; set; }
        public string concepto { get; set; }
        public string detalle { get; set; }

        public string spParams { get; set; }
    }
}
