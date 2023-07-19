using Domain.Models.Almacen;

namespace Domain.ViewModels.Almacen
{
    public class SubFamiliaViewModel
    {
        public SubFamilia subFamilia { get; set; }
        public int totalRecords { get; set; }
        public string codigoArticulo { get; set; }
        public string nombreFamilia { get; set; }
    }
}
