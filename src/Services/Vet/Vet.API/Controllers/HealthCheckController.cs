namespace Vet.API.Controllers;

public class HealthCheckController(IHealthCheckService healthCheckService) : BaseApiController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] HealthCheck healthCheck)
    {
        if (id != healthCheck.Id) return BadRequest("Id no coincide");

        healthCheck.UpdatedByUserId = User.GetUserId();

        return Ok(await healthCheckService.UpdateAsync(id, healthCheck));
    }
}
