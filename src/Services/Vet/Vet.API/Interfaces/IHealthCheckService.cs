namespace Vet.API.Interfaces;

public interface IHealthCheckService
{
    Task<ApiResponse> UpdateAsync(int id, HealthCheck healthCheck);
}
