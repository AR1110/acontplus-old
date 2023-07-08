using Lib.Common.Api;
using Vet.Core.Entities;

namespace Vet.Core.Interfaces
{
    public interface IMedicalHistory
    {
        public Task<APIResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<APIResponse> GetByIdAsync(int id);
        public Task<APIResponse> AddAsync(MedicalHistory medicalHistory);
        public Task<APIResponse> UpdateAsync(int id, MedicalHistory medicalHistory);
        public Task<APIResponse> DeleteAsync(int id);

    }
}
