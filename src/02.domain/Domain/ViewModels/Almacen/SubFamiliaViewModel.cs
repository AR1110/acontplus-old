using Domain.Models.Almacen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Almacen
{
    public class SubFamiliaViewModel
    {
        public SubFamilia subFamilia { get; set; }
        public int totalRecords { get; set; }
        public string codigoArticulo { get; set; }
        public string nombreFamilia { get; set; }
    }
}
