using Domain.Models.Administracion;

namespace Domain.ViewModels.Administracion
{
    public class UsuarioViewModel
    {
        public Usuario usuario { get; set; }
        public int idEntidad { get; set; }
        public int idSucursal { get; set; }
        public int idPolitica { get; set; }

        public int totalRecords { get; set; }

    }
}
