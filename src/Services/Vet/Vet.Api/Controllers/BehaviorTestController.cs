namespace Vet.Api.Controllers;

public class BehaviorTestController(IBehaviorTestRepository behaviorTestService) : BaseApiController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] BehaviorTest behaviorTest)
    {
        if (id != behaviorTest.Id) return BadRequest("Id no coincide");

        behaviorTest.UpdatedByUserId = User.GetUserId();
        return Ok(await behaviorTestService.UpdateAsync(id, behaviorTest));
    }
}
