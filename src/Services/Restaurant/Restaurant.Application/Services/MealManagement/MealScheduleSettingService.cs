namespace Restaurant.Application.Services.MealManagement;

public class MealScheduleSettingService(IUnitOfWork unitOfWork) : IMealScheduleSettingService
{
    private readonly IRepository<MealScheduleSetting> _mealScheduleSettingRepository = unitOfWork.GetRepository<MealScheduleSetting>();
    public async Task<Result<MealScheduleSettingItem, DomainError>> AddAsync(MealScheduleSettingCreate request, CancellationToken cancellationToken)
    {
        return await _mealScheduleSettingRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealScheduleSetting = Mapster.TypeAdapter.Adapt<MealScheduleSetting>(request);
            await _mealScheduleSettingRepository.AddAsync(mealScheduleSetting);
            return Result<MealScheduleSettingItem, DomainError>.Success(mealScheduleSetting.Adapt<MealScheduleSettingItem>());
        });
    }
    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        return await _mealScheduleSettingRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealScheduleSetting = await _mealScheduleSettingRepository.GetByIdOrDefaultAsync(id, cancellationToken: cancellationToken);
            if (mealScheduleSetting == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MEAL_SCHEDULE_SETTING_NOT_FOUND", "Meal schedule setting not found"));
            mealScheduleSetting.IsDeleted = true;
            mealScheduleSetting.IsActive = false;
            await _mealScheduleSettingRepository.UpdateAsync(mealScheduleSetting, cancellationToken: cancellationToken);
            return Result<bool, DomainError>.Success(true);
        });
    }
    public async Task<Result<IReadOnlyList<MealScheduleSettingItem>, DomainError>> GetAsync(int EstablishmentId, CancellationToken cancellationToken)
    {
        return await _mealScheduleSettingRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealScheduleSettings = await _mealScheduleSettingRepository.FindAsync(predicate: x => x.EstablishmentId == EstablishmentId, cancellationToken: cancellationToken);
            return Result<IReadOnlyList<MealScheduleSettingItem>, DomainError>.Success(mealScheduleSettings.Adapt<IReadOnlyList<MealScheduleSettingItem>>());
        });
    }
    public async Task<Result<MealScheduleSettingItem, DomainError>> UpdateAsync(int id, MealScheduleSettingUpdate request, CancellationToken cancellationToken)
    {
        return await _mealScheduleSettingRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealScheduleSetting = await _mealScheduleSettingRepository.GetByIdOrDefaultAsync(id);
            if (mealScheduleSetting == null)
                return Result<MealScheduleSettingItem, DomainError>.Failure(DomainError.NotFound("MEAL_SCHEDULE_SETTING_NOT_FOUND", "Meal schedule setting not found"));
            mealScheduleSetting.MealCode = request.MealCode;
            mealScheduleSetting.Description = request.Description;
            mealScheduleSetting.StartTime = request.StartTime;
            mealScheduleSetting.EndTime = request.EndTime;
            mealScheduleSetting.DisplayOrder = request.DisplayOrder;
            mealScheduleSetting.IsActive = request.IsActive;
            mealScheduleSetting.UpdatedByUserId = request.UpdatedByUserId;
            mealScheduleSetting.UpdatedAt = DateTime.UtcNow;
            await _mealScheduleSettingRepository.UpdateAsync(mealScheduleSetting);
            return Result<MealScheduleSettingItem, DomainError>.Success(mealScheduleSetting.Adapt<MealScheduleSettingItem>());
        });
    }
}

