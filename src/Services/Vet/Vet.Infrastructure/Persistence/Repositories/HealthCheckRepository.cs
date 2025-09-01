namespace Vet.Infrastructure.Persistence.Repositories;

public class HealthCheckRepository(VetContext context) : IHealthCheckRepository
{
    public async Task<ApiResponse> UpdateAsync(int id, HealthCheck healthCheck)
    {
        var healthCheckFound = await context.HealthChecks.FindAsync(id);
        if (healthCheckFound == null) return new ApiResponse { Code = "0", Message = "Item no encontrado!" };

        healthCheckFound.DiseaseId = healthCheck.DiseaseId;
        healthCheckFound.DiseaseStatusId = healthCheck.DiseaseStatusId;
        healthCheckFound.UpdatedByUserId = healthCheck.UpdatedByUserId;

        context.Update(healthCheckFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente", Payload = healthCheck };
    }
}
