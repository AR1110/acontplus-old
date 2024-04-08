namespace Restaurant.API.Interfaces
{
    public interface IPromotionMenuService
    {
        public Task<object> GetByIdAsync(Dictionary<string, object> parameters);
    }
}
