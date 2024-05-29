namespace Vet.API.Services;

public class HealthCheckService(VetContext context) : IHealthCheckService
{
    public async Task<ApiResponse> UpdateAsync(int id, HealthCheck healthCheck)
    {
        var healthCheckFound = await context.HealthChecks.FindAsync(id);
        if (healthCheckFound == null)
        {
            return new ApiResponse { code = "0", message = "Item no encontrado!" };
        }

        healthCheckFound.DiseaseId = healthCheck.DiseaseId;
        healthCheckFound.DiseaseStatusId = healthCheck.DiseaseStatusId;
        healthCheckFound.UserId = healthCheck.UserId;

        context.Update(healthCheckFound);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizado Exitosamente", payload = healthCheck };
    }
}
