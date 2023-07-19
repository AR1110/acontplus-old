using Domain.Models;

namespace Domain.ViewModels.Administracion
{
    public class EntidadViewModel
    {
        public Entidad entidad { get; set; }
        public int totalRecords { get; set; }
        public string subContribuyente { get; set; }
        public string ciudad { get; set; }
        public string anioFiscal { get; set; }
        public long idUsuario { get; set; }
        public long idPolitica { get; set; }
    }
}
