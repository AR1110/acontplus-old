using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IPromotionMenuService
    {
        public Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    }
}
