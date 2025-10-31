using Microsoft.AspNetCore.Mvc;

namespace Restaurant.API.Controllers;

public class EmployeeMealPlanController(IEmployeeMealPlanService employeeMealPlanService) : BaseApiController
{
    [HttpGet("employee/{companyCustomerId}")]
    public async Task<IActionResult> GetEmployeeMealPlans(int companyCustomerId)
    {
        var response = await employeeMealPlanService.GetEmployeeMealPlansAsync(companyCustomerId);
        return Ok(response);
    }

    [HttpGet("employee/{companyCustomerId}/active")]
    public async Task<IActionResult> GetActiveEmployeeMealPlan(int companyCustomerId)
    {
        var response = await employeeMealPlanService.GetActiveEmployeeMealPlanAsync(companyCustomerId);
        return Ok(response);
    }

    [HttpGet("employee/{companyCustomerId}/summary")]
    public async Task<IActionResult> GetEmployeeMealSummary(int companyCustomerId)
    {
        var response = await employeeMealPlanService.GetEmployeeMealSummaryAsync(companyCustomerId);
        return Ok(response);
    }

    [HttpPost("assign")]
    public async Task<IActionResult> AssignMealPlan([FromBody] CreateEmployeeMealPlanRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await employeeMealPlanService.AssignMealPlanAsync(request);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployeeMealPlan(int id, [FromBody] UpdateEmployeeMealPlanRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await employeeMealPlanService.UpdateEmployeeMealPlanAsync(id, request);
        return Ok(response);
    }

    [HttpPut("{id}/deactivate")]
    public async Task<IActionResult> DeactivateEmployeeMealPlan(int id, [FromBody] string reason)
    {
        var response = await employeeMealPlanService.DeactivateEmployeeMealPlanAsync(id, reason);
        return Ok(response);
    }
}
