using Loyalty.Domain.Entities;

namespace Loyalty.Application.Interfaces;

public interface ILoyaltyRulesEngine
{
    Task ProcessRulesAsync(int companyId, int companyCustomerId, LoyaltyTransaction transaction);
    //Task<List<AvailableBenefit>> EvaluateRuleForBenefitsAsync(LoyaltyRule rule, CompanyCustomer customer, string sourceModule);
}
