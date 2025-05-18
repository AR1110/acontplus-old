namespace Vet.API.Interfaces;

public interface IBehaviorTestService
{
    Task<ApiResponse> UpdateAsync(int id, BehaviorTest behaviorTest);
}