using Microsoft.Extensions.Logging;

namespace Restaurant.Application.Services.MealManagement;

public class MealConsumptionService(IUnitOfWork unitOfWork, ILogger<MealConsumptionService> logger) : IMealConsumptionService
{
    private readonly IRepository<MealConsumption> _mealConsumptionRepository =
        unitOfWork.GetRepository<MealConsumption>();

    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    private readonly ILogger<MealConsumptionService> _logger = logger;

    public async Task<Result<MealConsumptionItem, DomainError>> AddAsync(MealConsumptionCreate request,
        CancellationToken cancellationToken = default)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption = Mapster.TypeAdapter.Adapt<MealConsumption>(request);

            await _mealConsumptionRepository.AddAsync(mealConsumption, cancellationToken);
            return Result<MealConsumptionItem, DomainError>.Success(mealConsumption.Adapt<MealConsumptionItem>());
        }, cancellationToken);
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption =
                await _mealConsumptionRepository.GetByIdOrDefaultAsync(id, cancellationToken: cancellationToken);
            if (mealConsumption == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MEAL_CONSUMPTION_NOT_FOUND",
                    "Meal consumption not found"));
            mealConsumption.IsDeleted = true;
            mealConsumption.IsActive = false;
            await _mealConsumptionRepository.UpdateAsync(mealConsumption, cancellationToken: cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }, cancellationToken);
    }

    public async Task<Result<PagedResult<MealConsumptionItem>, DomainError>> GetAsync(
        PaginationRequest paginationRequest, CancellationToken cancellationToken)
    {
        try
        {
            var response =
                await _adoRepository.GetPagedFromStoredProcedureAsync<MealConsumptionItem>(
                    "Restaurant.GetMealConsumptions", paginationRequest, cancellationToken: cancellationToken);

            if (response.Items.Any())
            {
                return Result<PagedResult<MealConsumptionItem>, DomainError>.Success(response);
            }

            var error = DomainError.NotFound("MEAL_CONSUMPTION_NOT_FOUND", "No items were found.");
            return Result<PagedResult<MealConsumptionItem>, DomainError>.Failure(error);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("MEAL_CONSUMPTION_ERROR",
                $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<MealConsumptionItem>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<PagedResult<CustomerMealConsumptionItem>, DomainError>> SearchCustomerAsync(
        PaginationRequest paginationRequest, CancellationToken cancellationToken)
    {
        try
        {
            var response =
                await _adoRepository.GetPagedFromStoredProcedureAsync<CustomerMealConsumptionItem>(
                    "Restaurant.SearchCustomerMealConsumption", paginationRequest,
                    cancellationToken: cancellationToken);

            if (response.Items.Any())
            {
                return Result<PagedResult<CustomerMealConsumptionItem>, DomainError>.Success(response);
            }

            var error = DomainError.NotFound("CUSTOMER_NOT_FOUND", "No items were found.");
            return Result<PagedResult<CustomerMealConsumptionItem>, DomainError>.Failure(error);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching customer meal consumption for page {PageIndex}, size {PageSize}",
                paginationRequest.PageIndex, paginationRequest.PageSize);

            return DomainError.Internal(
                code: "SEARCH_CUSTOMER_MEAL_CONSUMPTION_FAILED",
                message: "Failed to retrieve customer meal consumption due to an internal error",
                details: new Dictionary<string, object>
                {
                    ["operation"] = "SearchCustomerMealConsumption",
                    ["pageIndex"] = paginationRequest.PageIndex,
                    ["pageSize"] = paginationRequest.PageSize
                }
            );
        }
    }

    public async Task<Result<MealConsumptionItem, DomainError>> UpdateAsync(int id, MealConsumptionUpdate request,
        CancellationToken cancellationToken)
    {
        return await _mealConsumptionRepository.ExecuteInTransactionAsync(async () =>
        {
            var mealConsumption = await _mealConsumptionRepository.GetByIdOrDefaultAsync(id, cancellationToken);
            if (mealConsumption == null)
                return Result<MealConsumptionItem, DomainError>.Failure(
                    DomainError.NotFound("MEAL_CONSUMPTION_NOT_FOUND", "Meal consumption not found"));
            mealConsumption.MealScheduleSettingId = request.MealScheduleSettingId;
            mealConsumption.CompanyCustomerMealPlanId = request.CompanyCustomerMealPlanId;
            mealConsumption.ConsumptionDate = request.ConsumptionDate;
            mealConsumption.Amount = request.Amount;
            mealConsumption.Status = request.ConsumptionStatus;
            mealConsumption.CancellationReason = request.CancellationReason;
            mealConsumption.CancelledByUserId = request.CancelledByUserId;
            mealConsumption.CancelledAt = request.CancelledAt;
            mealConsumption.CancelledIpAddress = request.CancelledIpAddress;
            await _mealConsumptionRepository.UpdateAsync(mealConsumption, cancellationToken);
            return Result<MealConsumptionItem, DomainError>.Success(mealConsumption.Adapt<MealConsumptionItem>());
        }, cancellationToken);
    }
}
