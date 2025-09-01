namespace Vet.Domain.Repositories;

public interface IMedicalHistoryRepository
{
    Task<ApiResponse> AddAsync(MedicalHistory medicalHistory);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(int id, MedicalHistory medicalHistory);
}
