using Domain.Models.Sri;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Administracion
{
    public class PuntoEmisionViewModel
    {
        //public PuntoEmision puntoEmision { get; set; }
        public string sucursal { get; set; }
        public string ambiente { get; set; }
        public int totalRecords { get; set; }
        public string ptoEmision { get; set; }
    }
}
