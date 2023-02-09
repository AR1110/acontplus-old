using Domain.Models.Compras;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Compras
{
    public class ManejoArticuloViewModel
    {
        public ManejoArticulo manejoArticulo { get; set; }
        public string descripcion { get; set; }
        public string json { get; set; }
    }
}
