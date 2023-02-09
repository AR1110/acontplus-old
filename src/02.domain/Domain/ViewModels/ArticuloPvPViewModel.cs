using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
