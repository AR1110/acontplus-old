using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record DocDetailleTemporalDto : DetalleBaseDto
    {
        public required int IdDetalle { get; set; }
        public required int IdDocumento { get; set; }

        public string? CodArticulo { get; set; }

        [MaxLength(100)]
        public string? CodigoPrincipal { get; set; }

        [MaxLength(100)]
        public string? CodigoAuxiliar { get; set; }

        [MaxLength(100)]
        public string? Codigo { get; set; }

        public string? Valor { get; set; }

        public bool? Todos { get; set; } = true;
    }
}