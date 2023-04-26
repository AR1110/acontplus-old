using Domain.Models;
namespace Domain.ViewModels
{
    public class ArticuloPvPViewModel
    {
        public ArticuloPvP articuloPvP { get; set; }
        public string tarifa { get; set; }
        public decimal porcentajeIva { get; set; }
        public bool predeterminada { get; set; }
    }
}
