namespace Vet.Domain.Repositories;

public interface IHealthCheckRepository
{
    Task<ApiResponse> UpdateAsync(int id, HealthCheck healthCheck);
}
