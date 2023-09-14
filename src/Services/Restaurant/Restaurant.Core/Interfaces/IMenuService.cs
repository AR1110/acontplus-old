using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IMenuService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
        public Task<string> PutAsync(int id, ApiRequest request);
    }
}
