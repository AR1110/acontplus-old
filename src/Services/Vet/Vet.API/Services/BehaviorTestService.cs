namespace Vet.API.Services;

public class BehaviorTestService(VetContext context) : IBehaviorTestService
{
    public async Task<ApiResponse> UpdateAsync(int id, BehaviorTest behaviorTest)
    {
        var test = await context.BehaviorTests.FindAsync(id);
        if (test == null)
        {
            return new ApiResponse { Code = "0", Message = "Item no encontrado!" };
        }

        test.BehaviorId = behaviorTest.BehaviorId;
        test.BehaviorStatusId = behaviorTest.BehaviorStatusId;
        test.UserId = behaviorTest.UserId;
        context.Update(test);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente", Payload = behaviorTest };
    }
}
