namespace Reports.API.Interfaces
{
    public interface IDashboardService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}
