namespace Vet.API.Services;

public class MedicalHistoryService(IADORepository genericRepository, VetContext context) : IMedicalHistory
{
    public async Task<ApiResponse> AddAsync(MedicalHistory medicalHistory)
    {
        if (medicalHistory.BehaviorTests.Count > 0)
        {
            foreach (var item in medicalHistory.BehaviorTests)
            {
                item.UserId = medicalHistory.UserId;
            }
        }

        if (medicalHistory.HealthChecks.Count > 0)
        {
            foreach (var item in medicalHistory.HealthChecks)
            {
                item.UserId = medicalHistory.UserId;
            }
        }

        context.MedicalHistories.Add(medicalHistory);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Registrado exitosamente", payload = medicalHistory.Id };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var medicalHistory = await context.MedicalHistories.FindAsync(id);
        if (medicalHistory == null)
        {
            return new ApiResponse { code = "0", message = "Registro no encontrado" };
        }

        medicalHistory.Deleted = true;
        medicalHistory.Enabled = false;
        medicalHistory.UserId = userId;
        context.Update(medicalHistory);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await genericRepository.GetDataSetAsync("Pet.MedicalHistory_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { code = "0", message = "La transacción no devolvio respuesta" }
            : new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await genericRepository.GetDataSetAsync("Pet.MedicalHistory_GetById", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { code = "0", message = "La transacción no devolvio respuesta" }
            : new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, MedicalHistory medicalHistory)
    {
        var medicalHistoryFound = await context.MedicalHistories.FindAsync(id);
        if (medicalHistoryFound == null)
        {
            return new ApiResponse { code = "0", message = "Registro no encontrado" };
        }

        medicalHistoryFound.Date = medicalHistory.Date;
        medicalHistoryFound.Observations = medicalHistory.Observations;
        medicalHistoryFound.Age = medicalHistory.Age;
        medicalHistoryFound.Weight = medicalHistory.Weight;
        medicalHistoryFound.CodEstab = medicalHistory.CodEstab;
        medicalHistoryFound.UserId = medicalHistory.UserId;
        context.Update(medicalHistoryFound);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
    }
}
