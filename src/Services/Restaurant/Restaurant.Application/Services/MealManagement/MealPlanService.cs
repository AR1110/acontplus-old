namespace Restaurant.Application.Services.MealManagement;

public class MealPlanService(IUnitOfWork unitOfWork) : IMealPlanService
{
    private readonly IRepository<MealPlan> _mealPlanRepository = unitOfWork.GetRepository<MealPlan>();
    public async Task<Result<MealPlanResponse, DomainError>> AddAsync(CreateMealPlanRequest request, CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = TypeAdapter.Adapt<MealPlan>(request);
            await _mealPlanRepository.AddAsync(mealPlan, cancellationToken);
            return Result<MealPlanResponse, DomainError>.Success(TypeAdapter.Adapt<MealPlanResponse>(mealPlan));
        });
    }
    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = await _mealPlanRepository.GetByIdAsync(id, cancellationToken);
            if (mealPlan == null)
            {
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MEAL_PLAN_NOT_FOUND", "Meal plan not found"));
            }
            mealPlan.IsDeleted = true;
            mealPlan.IsActive = false;
            await _mealPlanRepository.UpdateAsync(mealPlan, cancellationToken);
            return Result<bool, DomainError>.Success(true);
        });
    }
    public async Task<Result<IReadOnlyList<MealPlanResponse>, DomainError>> GetAsync(int EstablishmentId, CancellationToken cancellationToken)
    {
        var mealPlans = await _mealPlanRepository.FindAsync(
            predicate: mp => mp.EstablishmentId == EstablishmentId && !mp.IsDeleted,
            cancellationToken: cancellationToken);
        var mealPlanResponses = TypeAdapter.Adapt<IReadOnlyList<MealPlanResponse>>(mealPlans);
        return Result<IReadOnlyList<MealPlanResponse>, DomainError>.Success(mealPlanResponses);
    }
    public async Task<Result<MealPlanResponse, DomainError>> UpdateAsync(int id, UpdateMealPlanRequest request, CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = await _mealPlanRepository.GetByIdAsync(id, cancellationToken);
            if (mealPlan == null)
            {
                return Result<MealPlanResponse, DomainError>.Failure(DomainError.NotFound("MEAL_PLAN_NOT_FOUND", "Meal plan not found"));
            }
            TypeAdapter.Adapt(request, mealPlan);
            await _mealPlanRepository.UpdateAsync(mealPlan, cancellationToken);
            return Result<MealPlanResponse, DomainError>.Success(TypeAdapter.Adapt<MealPlanResponse>(mealPlan));
        });
    }
}

