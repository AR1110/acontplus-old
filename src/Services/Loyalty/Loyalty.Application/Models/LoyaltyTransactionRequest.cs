using Loyalty.Domain.Enums;

namespace Loyalty.Application.Models;

public class LoyaltyTransactionRequest
{
    public int CompanyId { get; set; }
    public int CompanyCustomerId { get; set; }
    public LoyaltyTransactionType TransactionType { get; set; }
    public decimal TransactionAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public int PointsUsed { get; set; }
    public int ItemCount { get; set; } = 1;
    public string? SourceModule { get; set; }
    public string? SourceTransactionId { get; set; }
    public string? EventData { get; set; }
    public string? Description { get; set; }
}
