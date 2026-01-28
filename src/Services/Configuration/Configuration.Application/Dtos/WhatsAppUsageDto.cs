namespace Configuration.Application.Dtos;

public class WhatsAppUsageItem
{
    public int? Id { get; set; }
    public int CompanyId { get; set; }

    public int Used { get; set; }

    public int Limit { get; set; }

    public bool Unlimited { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }
    public int? CreatedByUserId { get; set; }
    public int? UpdatedByUserId { get; set; }
    public bool IsActive { get; set; }
}