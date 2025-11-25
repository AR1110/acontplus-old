using Loyalty.Domain.Enums;

namespace Loyalty.Application.Models;

public class LoyaltyAlert
{
    public LoyaltyAlertType Type { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public AlertPriority Priority { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Dictionary<string, object> Metadata { get; set; } = [];
}
