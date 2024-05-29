namespace Vet.API.Controllers;

public class BehaviorTestController(IBehaviorTestService behaviorTestService) : BaseApiController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBehaviorTest(int id, [FromBody] BehaviorTest behaviorTest)
    {
        if (id != behaviorTest.Id)
        {
            return BadRequest("Id no coincide");
        }

        behaviorTest.UserId = User.GetUserId();
        return Ok(await behaviorTestService.UpdateAsync(id, behaviorTest));
    }
}
