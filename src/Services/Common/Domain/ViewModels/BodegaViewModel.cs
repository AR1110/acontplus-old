using Domain.Models;

namespace Domain.ViewModels
{
    public class BodegaViewModel
    {
        public Bodega bodega { get; set; }
        public string nombreSucursal { get; set; }
        public int totalRecords { get; set; }
    }
}
