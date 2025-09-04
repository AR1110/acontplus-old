namespace Vet.Domain.Repositories;

public interface IHealthCheckRepository
{
    Task<SpResponse> UpdateAsync(int id, HealthCheck healthCheck);
}
