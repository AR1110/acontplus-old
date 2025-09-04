namespace Vet.Infrastructure.Persistence.Repositories;

public class MedicalHistoryRepository(IAdoRepository adoRepository, VetContext context) : IMedicalHistoryRepository
{
    public async Task<SpResponse> AddAsync(MedicalHistory medicalHistory)
    {
        if (medicalHistory.BehaviorTests.Count > 0)
            foreach (var item in medicalHistory.BehaviorTests)
                item.CreatedByUserId = medicalHistory.CreatedByUserId;

        if (medicalHistory.HealthChecks.Count > 0)
            foreach (var item in medicalHistory.HealthChecks)
                item.CreatedByUserId = medicalHistory.CreatedByUserId;

        context.MedicalHistories.Add(medicalHistory);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado exitosamente", Payload = medicalHistory.Id };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var medicalHistory = await context.MedicalHistories.FindAsync(id);
        if (medicalHistory == null) return new SpResponse { Code = "0", Message = "Registro no encontrado" };

        medicalHistory.MarkAsDeleted(userId);
        context.Update(medicalHistory);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado Exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Vet.MedicalHistory_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await adoRepository.GetDataSetAsync("Vet.MedicalHistory_GetById", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAsync(int id, MedicalHistory medicalHistory)
    {
        var medicalHistoryFound = await context.MedicalHistories.FindAsync(id);
        if (medicalHistoryFound == null) return new SpResponse { Code = "0", Message = "Registro no encontrado" };

        medicalHistoryFound.Date = medicalHistory.Date;
        medicalHistoryFound.Observations = medicalHistory.Observations;
        medicalHistoryFound.Age = medicalHistory.Age;
        medicalHistoryFound.Weight = medicalHistory.Weight;
        medicalHistoryFound.EstablecimientoId = medicalHistory.EstablecimientoId;
        medicalHistoryFound.UpdatedByUserId = medicalHistory.UpdatedByUserId;
        context.Update(medicalHistoryFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
