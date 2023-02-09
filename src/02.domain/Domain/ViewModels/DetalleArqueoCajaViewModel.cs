using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class DetalleArqueoCajaViewModel
    {
        public DetalleArqueoCaja detalleArqueoCaja { get; set; }
        public string descripcionMoneda { get; set; }
        public decimal valorMoneda { get; set; }

    }
}
