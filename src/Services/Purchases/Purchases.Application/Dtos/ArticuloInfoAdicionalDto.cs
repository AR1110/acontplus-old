namespace Purchases.Application.Dtos
{
    public record ArticuloInfoAdicionalDto
    {
        public int? IdInfoAdicional { get; set; }

        public required int IdArticulo { get; set; }

        public required int IdEtiqueta { get; set; }

        public required string JsonAdicional { get; set; }
    }
}