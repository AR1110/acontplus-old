using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inventario.API.Dtos
{
    public class FamiliaDto
    {
        public int? IdFamilia { get; set; }
        public required string Descripcion { get; set; }
        public string? Siglas { get; set; }
        public int? ActividadEconomicaId { get; set; }
        public required bool Estado { get; set; } = true;
    }
}