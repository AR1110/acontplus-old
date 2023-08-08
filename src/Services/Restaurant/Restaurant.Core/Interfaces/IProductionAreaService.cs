namespace Restaurant.Core.Interfaces
{
    public interface IProductionAreaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
