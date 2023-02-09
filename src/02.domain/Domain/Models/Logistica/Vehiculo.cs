using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Logistica
{
    public class Vehiculo
    {
        public int idVehiculo { get; set; }
        public string placa { get; set; }
        public string marca { get; set; }
        public string modelo { get; set; }
        public string observacion { get; set; }
        public bool estado { get; set; }
    }
}
