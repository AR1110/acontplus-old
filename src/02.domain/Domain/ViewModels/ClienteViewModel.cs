using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class ClienteViewModel
    {
        public Cliente cliente { get; set; }
        public string tipoClienteProveedor { get; set; }
        public string tipoEntidad { get; set; }
        public string subContribuyente { get; set; }
        public string tiempoCredito { get; set; }
        public string tipoIdentificacion { get; set; }
        public string ciudad { get; set; }
        public string provincia { get; set; }
        public int totalRecords { get; set; }
        public int diasCredito { get; set; }
        public string nombreCompleto { get; set; }
    }
}
