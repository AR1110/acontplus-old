using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain.Models
{
    public class PtoEmision
    {
        public int idPtoEmision { get; set; }
        public string codPtoEmi { get; set; }
        public string codEstab { get; set; }
        public string ambiente { get; set; }
        public string ptoEmi { get; set; }
        public bool estado { get; set; }

    }

}