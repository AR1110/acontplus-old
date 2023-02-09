using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class EmpleadoViewModel
    {
        public Empleado empleado { get; set; }
        public int totalRecords { get; set; }
        public int totalClientes { get; set; }
    }
}
