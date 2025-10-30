namespace Inventory.Application.DTOs;

public record MassiveTaxDto
{
    public int? TaxIdFrom { get; set; }
    public required int TaxIdTo { get; set; }
    public required int Quantity { get; set; }
    public required string Obs { get; set; }
    public int? SubCategoryId { get; set; } = 0;
};