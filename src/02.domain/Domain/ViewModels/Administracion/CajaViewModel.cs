using Domain.Models.Administracion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.ViewModels.Administracion
{
    public class CajaViewModel
    {
        public Caja caja { get; set; }
        public string conectado { get; set; }
        public string usuarioAsignado { get; set; }
        public int idTurno { get; set; }
        public string turno { get; set; }
        public int totalRecords { get; set; }
        public bool gestion { get; set; }
    }
}
