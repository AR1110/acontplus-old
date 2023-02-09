using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class BodegaViewModel
    {
        public Bodega bodega { get; set; }
        public string nombreSucursal { get; set; }
        public int totalRecords { get; set; }
    }
}
