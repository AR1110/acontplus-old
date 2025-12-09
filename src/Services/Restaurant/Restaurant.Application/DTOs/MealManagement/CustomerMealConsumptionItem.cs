namespace Restaurant.Application.Dtos.MealManagement;

public record CustomerMealConsumptionItem
{
    public int? CompanyCustomerMealPlanId { get; set; }
    public int CompanyCustomerId { get; set; }
    public required string BusinessName { get; set; }
    public required string IdCard { get; set; }
    public int? CustomerCompanyId { get; set; } // External company that customer belongs to
    public string? CustomerCompanyRole { get; set; } // Customer role in external company
    public string? CustomerCompanyName { get; set; } // Customer company name
}
