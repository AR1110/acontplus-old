namespace Vet.Api.Controllers;

public class HealthCheckController(IHealthCheckRepository healthCheckService) : BaseApiController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] HealthCheck healthCheck)
    {
        if (id != healthCheck.Id) return BadRequest("Id no coincide");

        healthCheck.UpdatedByUserId = User.GetUserId();

        return Ok(await healthCheckService.UpdateAsync(id, healthCheck));
    }
}
