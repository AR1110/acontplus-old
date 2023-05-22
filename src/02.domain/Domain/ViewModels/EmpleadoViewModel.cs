using Domain.Models;

namespace Domain.ViewModels
{
    public class EmpleadoViewModel
    {
        public Empleado empleado { get; set; }
        public int totalRecords { get; set; }
        public int totalClientes { get; set; }
    }
}
