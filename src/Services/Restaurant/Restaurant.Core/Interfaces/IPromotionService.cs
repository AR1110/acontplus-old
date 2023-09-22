using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IPromotionService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
        public Task<string> PostAsync(ApiRequest request);
        public Task<string> PutAsync(int id, ApiRequest request);
    }
}
