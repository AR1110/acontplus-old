namespace Domain.Models
{
    public class SubContribuyente
    {
        public int idSubContribuyente { get; set; }
        public TipoContribuyente tipoContribuyente { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public string fechaBaja { get; set; }
    }

    public class SubContribuyenteOperaciones
    {
        public SubContribuyente subContribuyente { get; set; }
        public TipoContribuyente tipoContribuyente { get; set; }

    }


}