using Common.Core.Models;

namespace Vet.API.Interfaces
{
    public interface IMedicalHistory
    {
        public Task<APIResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<APIResponse> GetByIdAsync(int id);
    }
}
