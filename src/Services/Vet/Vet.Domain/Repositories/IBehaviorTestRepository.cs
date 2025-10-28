namespace Vet.Domain.Repositories;

public interface IBehaviorTestRepository
{
    Task<SpResponse> UpdateAsync(int id, BehaviorTest behaviorTest);
}
