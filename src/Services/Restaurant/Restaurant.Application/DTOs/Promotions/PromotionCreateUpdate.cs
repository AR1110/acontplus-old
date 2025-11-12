using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Application.DTOs.Promotions;
public record PromotionCreateUpdate
{
    public int EstablishmentId { get; set; }
    public required string Description { get; set; }
    public required string PromotionDays { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
    public PromotionDetails[] PromotionDetails { get; set; }
}

public record PromotionDetails
{
    public int ItemId { get; set; }
    public int FeeId { get; set; }
    public int TaxId { get; set; }
    public int MeasureId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Obs { get; set; }
    public decimal CostPrice { get; set; }
    public decimal Subtotal { get; set; }
    public string? UniqueId { get; set; }
}
