using Lib.Common.Api;
using Vet.Core.Entities;

namespace Vet.Core.Interfaces
{
    public interface IMedicalHistory
    {
        public Task<APIResponse> Get(ApiRequest parameters);
        public Task<APIResponse> GetById(int id);
        public Task<APIResponse> Insert(MedicalHistory medicalHistory);
        public Task<APIResponse> Update(int id, MedicalHistory medicalHistory);
        public Task<APIResponse> Delete(int id);

    }
}
