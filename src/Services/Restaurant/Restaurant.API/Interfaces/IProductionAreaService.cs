namespace Restaurant.API.Interfaces
{
    public interface IProductionAreaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
