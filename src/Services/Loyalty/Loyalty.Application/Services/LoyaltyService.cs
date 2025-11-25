namespace Loyalty.Application.Services;

public class LoyaltyService
{
    //private readonly IRepository<CompanyCustomer> _companyCustomerRepository;
    //private readonly IRepository<LoyaltyProgram> _loyaltyProgramRepository;
    //private readonly IRepository<LoyaltyTransaction> _loyaltyTransactionRepository;
    //private readonly IRepository<LoyaltyReward> _loyaltyRewardRepository;
    //private readonly IRepository<LoyaltyRule> _loyaltyRuleRepository;
    //private readonly IRepository<LoyaltyTier> _loyaltyTierRepository;
    //private readonly ILoyaltyRulesEngine _rulesEngine;

    //public LoyaltyService(
    //    IRepository<CompanyCustomer> companyCustomerRepository,
    //    IRepository<LoyaltyProgram> loyaltyProgramRepository,
    //    IRepository<LoyaltyTransaction> loyaltyTransactionRepository,
    //    IRepository<LoyaltyReward> loyaltyRewardRepository,
    //    IRepository<LoyaltyRule> loyaltyRuleRepository,
    //    IRepository<LoyaltyTier> loyaltyTierRepository,
    //    ILoyaltyRulesEngine rulesEngine)
    //{
    //    _companyCustomerRepository = companyCustomerRepository;
    //    _loyaltyProgramRepository = loyaltyProgramRepository;
    //    _loyaltyTransactionRepository = loyaltyTransactionRepository;
    //    _loyaltyRewardRepository = loyaltyRewardRepository;
    //    _loyaltyRuleRepository = loyaltyRuleRepository;
    //    _loyaltyTierRepository = loyaltyTierRepository;
    //    _rulesEngine = rulesEngine;
    //}

    //public async Task<LoyaltyCustomerProfile> GetCustomerProfileAsync(int companyId, int customerId)
    //{
    //    var companyCustomer = await _companyCustomerRepository.GetFirstAsync(
    //        cc => cc.CompanyId == companyId && cc.CustomerId == customerId,
    //        include: "Customer,CurrentTier,LoyaltyTransactions");

    //    if (companyCustomer == null)
    //        return null;

    //    var profile = new LoyaltyCustomerProfile
    //    {
    //        CompanyCustomerId = companyCustomer.Id,
    //        CustomerName = companyCustomer.Customer.FullName,
    //        BirthDate = companyCustomer.Customer.BirthDate,
    //        TotalTransactions = companyCustomer.TotalTransactions,
    //        CurrentLoyaltyPoints = companyCustomer.CurrentLoyaltyPoints,
    //        TotalSpent = companyCustomer.TotalSpent,
    //        AverageTransactionValue = companyCustomer.AverageTransactionValue,
    //        CurrentTier = companyCustomer.CurrentTier?.Name,
    //        FirstVisitDate = companyCustomer.FirstVisitDate,
    //        LastVisitDate = companyCustomer.LastVisitDate,
    //        AvailableBenefits = await GetAvailableBenefitsAsync(companyId, customerId),
    //        ActiveRewards = await GetActiveRewardsAsync(companyCustomer.Id)
    //    };

    //    return profile;
    //}

    //public async Task<List<AvailableBenefit>> GetAvailableBenefitsAsync(int companyId, int customerId, string sourceModule = null)
    //{
    //    var companyCustomer = await _companyCustomerRepository.GetFirstAsync(
    //        cc => cc.CompanyId == companyId && cc.CustomerId == customerId,
    //        include: "Customer,CurrentTier.Benefits");

    //    var benefits = new List<AvailableBenefit>();

    //    if (companyCustomer == null)
    //        return benefits;

    //    await AddBirthdayBenefitsAsync(benefits, companyId, companyCustomer);

    //    if (companyCustomer.CurrentTier != null)
    //    {
    //        await AddTierBenefitsAsync(benefits, companyCustomer.CurrentTier.Benefits, companyCustomer);
    //    }

    //    await AddRuleBasedBenefitsAsync(benefits, companyId, companyCustomer, sourceModule);

    //    return benefits.OrderByDescending(b => b.Priority).ToList();
    //}

    //public async Task<LoyaltyTransactionResult> ProcessTransactionAsync(LoyaltyTransactionRequest request)
    //{
    //    var companyCustomer = await _companyCustomerRepository.GetByIdAsync(request.CompanyCustomerId);
    //    var loyaltyProgram = await _loyaltyProgramRepository.GetFirstAsync(lp => lp.CompanyId == request.CompanyId && lp.IsActive);

    //    var result = new LoyaltyTransactionResult { Success = true };

    //    var pointsEarned = await CalculatePointsEarnedAsync(loyaltyProgram, request);

    //    var loyaltyTransaction = new LoyaltyTransaction
    //    {
    //        CompanyId = request.CompanyId,
    //        CompanyCustomerId = request.CompanyCustomerId,
    //        TransactionNumber = GenerateTransactionNumber(),
    //        TransactionDate = DateTime.Now,
    //        TransactionType = request.TransactionType,
    //        PointsEarned = pointsEarned,
    //        PointsUsed = request.PointsUsed,
    //        PointsBalance = companyCustomer.CurrentLoyaltyPoints + pointsEarned - request.PointsUsed,
    //        TransactionAmount = request.TransactionAmount,
    //        DiscountAmount = request.DiscountAmount,
    //        SourceModule = request.SourceModule,
    //        SourceTransactionId = request.SourceTransactionId,
    //        EventData = request.EventData,
    //        Description = request.Description
    //    };

    //    await _loyaltyTransactionRepository.AddAsync(loyaltyTransaction);

    //    companyCustomer.TotalTransactions++;
    //    companyCustomer.CurrentLoyaltyPoints = loyaltyTransaction.PointsBalance;
    //    companyCustomer.TotalSpent += request.TransactionAmount;
    //    companyCustomer.AverageTransactionValue = companyCustomer.TotalSpent / companyCustomer.TotalTransactions;
    //    companyCustomer.LastVisitDate = DateTime.Now;

    //    await _companyCustomerRepository.UpdateAsync(companyCustomer);

    //    var tierResult = await EvaluateCustomerTierAsync(request.CompanyId, companyCustomer.CustomerId);
    //    result.TierChanged = tierResult.TierChanged;
    //    result.NewTier = tierResult.NewTier;

    //    await _rulesEngine.ProcessRulesAsync(request.CompanyId, companyCustomer.Id, loyaltyTransaction);

    //    result.PointsEarned = pointsEarned;
    //    result.NewPointsBalance = loyaltyTransaction.PointsBalance;
    //    result.TransactionId = loyaltyTransaction.Id;

    //    return result;
    //}

    //public async Task<RewardApplicationResult> ApplyRewardAsync(int companyId, int customerId, int rewardId, string sourceModule, string sourceTransactionId)
    //{
    //    var reward = await _loyaltyRewardRepository.GetByIdAsync(rewardId);

    //    if (reward == null || reward.Status != RewardStatus.Available)
    //        return new RewardApplicationResult { Success = false, ErrorMessage = "Reward not available" };

    //    if (reward.ExpiryDate.HasValue && reward.ExpiryDate < DateTime.Now)
    //        return new RewardApplicationResult { Success = false, ErrorMessage = "Reward has expired" };

    //    reward.Status = RewardStatus.Used;
    //    reward.UsedDate = DateTime.Now;
    //    reward.UsedInModule = sourceModule;
    //    reward.UsedInTransactionId = sourceTransactionId;

    //    await _loyaltyRewardRepository.UpdateAsync(reward);

    //    return new RewardApplicationResult
    //    {
    //        Success = true,
    //        RewardValue = reward.RewardValue,
    //        RewardType = reward.RewardType,
    //        Description = reward.Description
    //    };
    //}

    //public async Task<TierEvaluationResult> EvaluateCustomerTierAsync(int companyId, int customerId)
    //{
    //    var companyCustomer = await _companyCustomerRepository.GetFirstAsync(
    //        cc => cc.CompanyId == companyId && cc.CustomerId == customerId,
    //        include: "CurrentTier");

    //    var loyaltyProgram = await _loyaltyProgramRepository.GetFirstAsync(
    //        lp => lp.CompanyId == companyId && lp.IsActive,
    //        include: "Tiers");

    //    var result = new TierEvaluationResult { Success = true };

    //    if (loyaltyProgram?.Tiers == null || !loyaltyProgram.Tiers.Any())
    //        return result;

    //    var qualifyingTier = loyaltyProgram.Tiers
    //        .Where(t => companyCustomer.CurrentLoyaltyPoints >= t.RequiredPoints &&
    //                   companyCustomer.TotalTransactions >= t.RequiredTransactions &&
    //                   companyCustomer.TotalSpent >= t.RequiredSpending)
    //        .OrderByDescending(t => t.OrderIndex)
    //        .FirstOrDefault();

    //    if (qualifyingTier != null &&
    //        (companyCustomer.CurrentTierId == null || qualifyingTier.Id != companyCustomer.CurrentTierId))
    //    {
    //        var previousTier = companyCustomer.CurrentTier?.Name ?? "None";

    //        companyCustomer.CurrentTierId = qualifyingTier.Id;
    //        companyCustomer.TierAchievedDate = DateTime.Now;

    //        await _companyCustomerRepository.UpdateAsync(companyCustomer);

    //        result.TierChanged = true;
    //        result.PreviousTier = previousTier;
    //        result.NewTier = qualifyingTier.Name;
    //        result.NewTierBenefits = qualifyingTier.Benefits?.Select(b => b.Name).ToList() ?? new List<string>();
    //    }

    //    return result;
    //}

    //public async Task<List<LoyaltyAlert>> GetLoyaltyAlertsAsync(int companyId, int customerId)
    //{
    //    var alerts = new List<LoyaltyAlert>();
    //    var companyCustomer = await _companyCustomerRepository.GetFirstAsync(
    //        cc => cc.CompanyId == companyId && cc.CustomerId == customerId,
    //        include: "Customer,CurrentTier");

    //    if (companyCustomer == null)
    //        return alerts;

    //    if (companyCustomer.Customer.BirthDate.HasValue)
    //    {
    //        var isBirthdayPeriod = await IsBirthdayPeriodAsync(companyId, companyCustomer.Customer.BirthDate.Value);
    //        if (isBirthdayPeriod && await CanUseBirthdayRewardAsync(companyCustomer))
    //        {
    //            alerts.Add(new LoyaltyAlert
    //            {
    //                Type = LoyaltyAlertType.Birthday,
    //                Title = "🎉 Birthday Celebration!",
    //                Message = $"It's {companyCustomer.Customer.FullName}'s birthday period - special rewards available!",
    //                Priority = AlertPriority.High
    //            });
    //        }
    //    }

    //    var nextTier = await GetNextQualifyingTierAsync(companyId, companyCustomer);
    //    if (nextTier != null)
    //    {
    //        alerts.Add(new LoyaltyAlert
    //        {
    //            Type = LoyaltyAlertType.TierUpgrade,
    //            Title = "🚀 Close to Next Tier!",
    //            Message = $"Customer is close to achieving {nextTier.Name} tier",
    //            Priority = AlertPriority.Medium
    //        });
    //    }

    //    var availableRewards = await _loyaltyRewardRepository.CountAsync(
    //        r => r.CompanyCustomerId == companyCustomer.Id && r.Status == RewardStatus.Available);

    //    if (availableRewards > 0)
    //    {
    //        alerts.Add(new LoyaltyAlert
    //        {
    //            Type = LoyaltyAlertType.AvailableRewards,
    //            Title = "🎁 Rewards Available!",
    //            Message = $"Customer has {availableRewards} reward(s) ready to use",
    //            Priority = AlertPriority.Medium
    //        });
    //    }

    //    return alerts;
    //}
}
