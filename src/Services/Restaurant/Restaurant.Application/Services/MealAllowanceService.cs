using Restaurant.Application.DTOs;

namespace Restaurant.Application.Services;

public interface IMealAllowanceService
{
    Task<SpResponse> GenerateMonthlyAllowanceAsync(int employeeMealPlanId, int year, int month);
    Task<SpResponse> GetEmployeeAllowanceAsync(int companyCustomerId, int year, int month);
    Task<SpResponse> UpdateAllowanceConsumptionAsync(int allowanceId, int consumedMeals);
    Task<SpResponse> GetAllowanceHistoryAsync(int companyCustomerId, int year);
}

public class MealAllowanceService(IAdoRepository adoRepository) : IMealAllowanceService
{
    public async Task<SpResponse> GenerateMonthlyAllowanceAsync(int employeeMealPlanId, int year, int month)
    {
        var parameters = new Dictionary<string, object>
        {
            { "EmployeeMealPlanId", employeeMealPlanId },
            { "Year", year },
            { "Month", month }
        };

        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.MonthlyMealAllowance_Generate", parameters);
    }

    public async Task<SpResponse> GetEmployeeAllowanceAsync(int companyCustomerId, int year, int month)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", companyCustomerId },
            { "Year", year },
            { "Month", month }
        };

        var ds = await adoRepository.GetDataSetAsync("Restaurant.MonthlyMealAllowance_GetByEmployee", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No allowance found for this period" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAllowanceConsumptionAsync(int allowanceId, int consumedMeals)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Id", allowanceId },
            { "ConsumedMeals", consumedMeals }
        };

        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.MonthlyMealAllowance_UpdateConsumption", parameters);
    }

    public async Task<SpResponse> GetAllowanceHistoryAsync(int companyCustomerId, int year)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", companyCustomerId },
            { "Year", year }
        };

        var ds = await adoRepository.GetDataSetAsync("Restaurant.MonthlyMealAllowance_GetHistory", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No allowance history found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
