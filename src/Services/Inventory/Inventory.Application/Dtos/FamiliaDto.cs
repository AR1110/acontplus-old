namespace Inventory.Application.Dtos
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