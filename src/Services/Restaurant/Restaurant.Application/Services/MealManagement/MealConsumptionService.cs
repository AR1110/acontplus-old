using Acontplus.Core.Extensions;
using Mapster;

namespace Restaurant.Application.Services.MealManagement;

public class MealConsumptionService(IUnitOfWork unitOfWork) : IMealConsumptionService
{
    private readonly IRepository<MealConsumption> _mealConsumptionRepository = unitOfWork.GetRepository<MealConsumption>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    public async Task<Result<MealConsumptionItem, DomainError>> AddAsync(MealConsumptionCreate request, CancellationToken cancellationToken = default)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption = Mapster.TypeAdapter.Adapt<MealConsumption>(request);

            await _mealConsumptionRepository.AddAsync(mealConsumption);
            return Result<MealConsumptionItem, DomainError>.Success(mealConsumption.Adapt<MealConsumptionItem>());
        });
    }
    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption = await _mealConsumptionRepository.GetByIdOrDefaultAsync(id, cancellationToken: cancellationToken);
            if (mealConsumption == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MEAL_CONSUMPTION_NOT_FOUND", "Meal consumption not found"));
            mealConsumption.IsDeleted = true;
            mealConsumption.IsActive = false;
            await _mealConsumptionRepository.UpdateAsync(mealConsumption, cancellationToken: cancellationToken);
            return Result<bool, DomainError>.Success(true);
        });
    }
    public async Task<Result<IReadOnlyList<PagedResult<MealConsumptionItem>>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken)
    {
        var ds = await _adoRepository.GetDataSetAsync("Restaurant.GetMealConsumptions", new Dictionary<string, object>
        {
            { "Json", JsonExtensions.SerializeOptimized(paginationRequest) },
        });
        return Result<IReadOnlyList<PagedResult<MealConsumptionItem>>, DomainError>.Success(ds.Tables[0].Adapt<IReadOnlyList<PagedResult<MealConsumptionItem>>>());
    }
    public async Task<Result<MealConsumptionItem, DomainError>> UpdateAsync(int id, MealConsumptionUpdate request, CancellationToken cancellationToken)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption = await _mealConsumptionRepository.GetByIdOrDefaultAsync(id);
            if (mealConsumption == null)
                return Result<MealConsumptionItem, DomainError>.Failure(DomainError.NotFound("MEAL_CONSUMPTION_NOT_FOUND", "Meal consumption not found"));
            mealConsumption.MealScheduleSettingId = request.MealScheduleSettingId;
            mealConsumption.CompanyCustomerMealPlanId = request.CompanyCustomerMealPlanId;
            mealConsumption.ConsumptionDate = request.ConsumptionDate;
            mealConsumption.Amount = request.Amount;
            mealConsumption.Status = request.ConsumptionStatus;
            mealConsumption.CancellationReason = request.CancellationReason;
            mealConsumption.CancelledByUserId = request.CancelledByUserId;
            mealConsumption.CancelledAt = request.CancelledAt;
            mealConsumption.CancelledIpAddress = request.CancelledIpAddress;
            await _mealConsumptionRepository.UpdateAsync(mealConsumption);
            return Result<MealConsumptionItem, DomainError>.Success(mealConsumption.Adapt<MealConsumptionItem>());
        });
    }
}

