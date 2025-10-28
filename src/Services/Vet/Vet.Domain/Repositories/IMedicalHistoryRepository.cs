namespace Vet.Domain.Repositories;

public interface IMedicalHistoryRepository
{
    Task<SpResponse> AddAsync(MedicalHistory medicalHistory);
    Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> UpdateAsync(int id, MedicalHistory medicalHistory);
}
