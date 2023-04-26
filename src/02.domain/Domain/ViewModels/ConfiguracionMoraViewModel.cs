using Domain.Models;

namespace Domain.ViewModels
{
    public class ConfiguracionMoraViewModel
    {
        public ConfiguracionMora configuracionMora { get; set; }
        public int totalRecords { get; set; }
        public string diaGracia { get; set; }
        public string configuracion { get; set; }
    }
}
