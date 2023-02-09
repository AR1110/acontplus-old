using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class ConfigPorcentajeViewModel
    {
        public int totalRecords { get; set; }
        public string empresa { get; set; }
        public string tipoIva { get; set; }
        public decimal valorTipoIva { get; set; }
        public string codigoTipoIva { get; set; }
    }
}
