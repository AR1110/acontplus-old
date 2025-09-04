namespace Vet.Infrastructure.Persistence.Repositories;

public class BehaviorTestRepository(VetContext context) : IBehaviorTestRepository
{
    public async Task<SpResponse> UpdateAsync(int id, BehaviorTest behaviorTest)
    {
        var test = await context.BehaviorTests.FindAsync(id);
        if (test == null) return new SpResponse { Code = "0", Message = "Item no encontrado!" };

        test.BehaviorId = behaviorTest.BehaviorId;
        test.BehaviorStatusId = behaviorTest.BehaviorStatusId;
        test.UpdatedByUserId = behaviorTest.UpdatedByUserId;
        context.Update(test);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado Exitosamente", Payload = behaviorTest };
    }
}
