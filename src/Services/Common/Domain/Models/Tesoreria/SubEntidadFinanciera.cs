namespace Domain.Models.Tesoreria
{
    public class SubEntidadFinanciera
    {
        public int idSubEntidadFinanciera { get; set; }
        public int idEntidadFinanciera { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public decimal interes { get; set; }
        public bool controlCaja { get; set; }
        public bool estado { get; set; }


    }
}
