namespace Vet.Domain.Repositories;

public interface IBehaviorTestRepository
{
    Task<ApiResponse> UpdateAsync(int id, BehaviorTest behaviorTest);
}
