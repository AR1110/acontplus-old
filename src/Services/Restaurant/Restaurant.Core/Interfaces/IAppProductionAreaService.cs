namespace Restaurant.Core.Interfaces
{
    public interface IAppProductionAreaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
