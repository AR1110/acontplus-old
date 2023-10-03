namespace TechnicalSupport.Core.Interfaces
{
    public interface IProductService
    {
        public Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
