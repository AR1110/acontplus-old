using Loyalty.Application.Models;

namespace Loyalty.Application.Interfaces;

public interface ILoyaltyService
{
    Task<LoyaltyCustomerProfile> GetCustomerProfileAsync(int companyId, int customerId);
    Task<List<AvailableBenefit>> GetAvailableBenefitsAsync(int companyId, int customerId, string sourceModule = null);
    Task<LoyaltyTransactionResult> ProcessTransactionAsync(LoyaltyTransactionRequest request);
    Task<RewardApplicationResult> ApplyRewardAsync(int companyId, int customerId, int rewardId, string sourceModule, string sourceTransactionId);
    Task<TierEvaluationResult> EvaluateCustomerTierAsync(int companyId, int customerId);
    Task<List<LoyaltyAlert>> GetLoyaltyAlertsAsync(int companyId, int customerId);
}
