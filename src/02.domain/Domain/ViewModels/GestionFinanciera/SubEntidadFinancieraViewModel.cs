using Domain.Models.Tesoreria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels.Tesoreria
{
    public class SubEntidadFinancieraViewModel
    {
        public SubEntidadFinanciera subEntidadFinanciera { get; set; }
        public string entidadFinanciera { get; set; }
        public int totalRecords { get; set; }

    }
}
