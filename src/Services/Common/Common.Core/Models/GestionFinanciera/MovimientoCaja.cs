namespace Common.Core.Models.GestionFinanciera
{
    public class MovimientoCaja
    {
        public long idMovimientoCaja { get; set; }
        public long idTipoDocumento { get; set; }
        public string codEstab { get; set; }
        public int idEmpleado { get; set; }
        public int idSubEntidadFinanciera { get; set; }
        public int idCaja { get; set; }
        public int nroDoc { get; set; }
        public string fechaEmision { get; set; }
        public decimal valor { get; set; }
        public string observaciones { get; set; }
        public bool estado { get; set; }

    }
}
