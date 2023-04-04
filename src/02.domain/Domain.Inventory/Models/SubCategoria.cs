using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Inventory.Models
{
    public class SubCategoria
    {
        public int idCategoria { get; set; }
        public string? siglas { get; set; }
        public decimal? montoObjetivo { get; set; }
    }
}
