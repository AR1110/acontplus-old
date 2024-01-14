using Common.Core.Models;

namespace Vet.API.Interfaces
{
    public interface IMedicalHistory
    {
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<ApiResponse> GetByIdAsync(int id);
    }
}
