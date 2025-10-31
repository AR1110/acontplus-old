namespace Restaurant.Application.Services;

public interface IEmployeeMealPlanService
{
    Task<SpResponse> GetEmployeeMealPlansAsync(int companyCustomerId);
    Task<SpResponse> GetActiveEmployeeMealPlanAsync(int companyCustomerId);
    Task<SpResponse> AssignMealPlanAsync(CreateEmployeeMealPlanRequest request);
    Task<SpResponse> UpdateEmployeeMealPlanAsync(int id, UpdateEmployeeMealPlanRequest request);
    Task<SpResponse> DeactivateEmployeeMealPlanAsync(int id, string reason);
    Task<SpResponse> GetEmployeeMealSummaryAsync(int companyCustomerId);
}

public class EmployeeMealPlanService(IAdoRepository adoRepository) : IEmployeeMealPlanService
{
    public async Task<SpResponse> GetEmployeeMealPlansAsync(int companyCustomerId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", companyCustomerId }
        };

        var ds = await adoRepository.GetDataSetAsync("Restaurant.EmployeeMealPlan_GetByCustomer", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No meal plans found for employee" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> GetActiveEmployeeMealPlanAsync(int companyCustomerId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", companyCustomerId },
            { "IsActive", true }
        };

        var ds = await adoRepository.GetDataSetAsync("Restaurant.EmployeeMealPlan_GetActive", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No active meal plan found for employee" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AssignMealPlanAsync(CreateEmployeeMealPlanRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", request.CompanyCustomerId },
            { "MealPlanId", request.MealPlanId },
            { "StartDate", request.StartDate },
            { "EndDate", request.EndDate },
            { "Notes", request.Notes ?? string.Empty }
        };

        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.EmployeeMealPlan_Insert", parameters);
    }

    public async Task<SpResponse> UpdateEmployeeMealPlanAsync(int id, UpdateEmployeeMealPlanRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Id", id },
            { "EndDate", request.EndDate },
            { "IsActive", request.IsActive },
            { "Notes", request.Notes ?? string.Empty }
        };

        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.EmployeeMealPlan_Update", parameters);
    }

    public async Task<SpResponse> DeactivateEmployeeMealPlanAsync(int id, string reason)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Id", id },
            { "IsActive", false },
            { "EndDate", DateTime.Now },
            { "Notes", $"Deactivated: {reason}" }
        };

        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.EmployeeMealPlan_Update", parameters);
    }

    public async Task<SpResponse> GetEmployeeMealSummaryAsync(int companyCustomerId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "CompanyCustomerId", companyCustomerId }
        };

        var ds = await adoRepository.GetDataSetAsync("Restaurant.EmployeeMealSummary_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No meal summary found for employee" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
