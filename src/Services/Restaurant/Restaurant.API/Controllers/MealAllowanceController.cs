using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.API.Controllers;

public class MealAllowanceController(IMealAllowanceService mealAllowanceService) : BaseApiController
{
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateMonthlyAllowance([FromBody] GenerateMonthlyAllowanceRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await mealAllowanceService.GenerateMonthlyAllowanceAsync(
            request.EmployeeMealPlanId,
            request.Year,
            request.Month);
        return Ok(response);
    }

    [HttpGet("employee/{companyCustomerId}/current")]
    public async Task<IActionResult> GetCurrentAllowance(int companyCustomerId)
    {
        var now = DateTime.Now;
        var response = await mealAllowanceService.GetEmployeeAllowanceAsync(
            companyCustomerId,
            now.Year,
            now.Month);
        return Ok(response);
    }

    [HttpGet("employee/{companyCustomerId}/{year}/{month}")]
    public async Task<IActionResult> GetEmployeeAllowance(int companyCustomerId, int year, int month)
    {
        var response = await mealAllowanceService.GetEmployeeAllowanceAsync(companyCustomerId, year, month);
        return Ok(response);
    }

    [HttpGet("employee/{companyCustomerId}/history/{year}")]
    public async Task<IActionResult> GetAllowanceHistory(int companyCustomerId, int year)
    {
        var response = await mealAllowanceService.GetAllowanceHistoryAsync(companyCustomerId, year);
        return Ok(response);
    }

    [HttpPut("{allowanceId}/consumption")]
    public async Task<IActionResult> UpdateConsumption(int allowanceId, [FromBody] UpdateAllowanceConsumptionRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await mealAllowanceService.UpdateAllowanceConsumptionAsync(allowanceId, request.ConsumedMeals);
        return Ok(response);
    }
}
