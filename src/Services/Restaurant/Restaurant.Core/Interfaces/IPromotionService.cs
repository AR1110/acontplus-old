namespace Restaurant.Core.Interfaces
{
    public interface IPromotionService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
        public Task<string> PostAsync(Dictionary<string, object> parameters);
        public Task<string> PutAsync(Dictionary<string, object> parameters);
    }
}
