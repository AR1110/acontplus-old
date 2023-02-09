using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Inventario
{
    public class TransferenciaBodega
    {
        public long idTransferenciaBodega { get; set; }
        public long idPuntoEmision { get; set; }
        public long idTipoDocumento { get; set; }
        public long idBodegaOrigen { get; set; }
        public long idBodegaDestino { get; set; }
        public long idEstadoDocumeto { get; set; }
        public long nroDoc { get; set; }
        public string fechaEmision { get; set; }
        public decimal total { get; set; }
        public bool estado { get; set; }
        public string observacion { get; set; }
    }

    public class TransferenciaBodegaParams
    {
        public string header { get; set; }  
        public string detail { get; set; }
    }
}
