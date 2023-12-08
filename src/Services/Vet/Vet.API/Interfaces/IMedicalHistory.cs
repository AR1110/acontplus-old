using Common.Core.Models;

namespace Vet.API.Interfaces
{
    public interface IMedicalHistory
    {
        public Task<APIResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<APIResponse> GetByIdAsync(int id);
        Task<ReportResponse> GetReportAsync(Dictionary<string, object> parameters);
        //public Task<APIResponse> AddAsync(MedicalHistory medicalHistory);
        //public Task<APIResponse> UpdateAsync(int id, MedicalHistory medicalHistory);
        //public Task<APIResponse> DeleteAsync(int id);

    }
}
