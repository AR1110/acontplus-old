namespace Restaurant.Application.Services.MealManagement;

public class MealPlanService(IUnitOfWork unitOfWork) : IMealPlanService
{
    private readonly IRepository<MealPlan> _mealPlanRepository = unitOfWork.GetRepository<MealPlan>();

    public async Task<Result<MealPlanItem, DomainError>> AddAsync(MealPlanCreate request,
        CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = TypeAdapter.Adapt<MealPlan>(request);
            await _mealPlanRepository.AddAsync(mealPlan, cancellationToken);
            return Result<MealPlanItem, DomainError>.Success(TypeAdapter.Adapt<MealPlanItem>(mealPlan));
        });
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = await _mealPlanRepository.GetByIdAsync(id, cancellationToken);
            if (mealPlan == null)
            {
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MEAL_PLAN_NOT_FOUND",
                    "Meal plan not found"));
            }

            mealPlan.IsDeleted = true;
            mealPlan.IsActive = false;
            await _mealPlanRepository.UpdateAsync(mealPlan, cancellationToken);
            return Result<bool, DomainError>.Success(true);
        });
    }

    public async Task<Result<IReadOnlyList<MealPlanItem>, DomainError>> GetAsync(int EstablishmentId,
        CancellationToken cancellationToken)
    {
        var mealPlans = await _mealPlanRepository.FindAsync(
            predicate: mp => mp.EstablishmentId == EstablishmentId && !mp.IsDeleted,
            cancellationToken: cancellationToken);
        var mealPlanResponses = TypeAdapter.Adapt<IReadOnlyList<MealPlanItem>>(mealPlans);
        return Result<IReadOnlyList<MealPlanItem>, DomainError>.Success(mealPlanResponses);
    }

    public async Task<Result<MealPlanItem, DomainError>> UpdateAsync(int id, MealPlanUpdate request,
        CancellationToken cancellationToken)
    {
        return await _mealPlanRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealPlan = await _mealPlanRepository.GetByIdAsync(id, cancellationToken);
            if (mealPlan == null)
            {
                return Result<MealPlanItem, DomainError>.Failure(DomainError.NotFound("MEAL_PLAN_NOT_FOUND",
                    "Meal plan not found"));
            }

            TypeAdapter.Adapt(request, mealPlan);
            await _mealPlanRepository.UpdateAsync(mealPlan, cancellationToken);
            return Result<MealPlanItem, DomainError>.Success(TypeAdapter.Adapt<MealPlanItem>(mealPlan));
        });
    }
}
