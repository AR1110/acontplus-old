namespace Reports.API.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
