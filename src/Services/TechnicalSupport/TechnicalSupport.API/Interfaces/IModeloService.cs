namespace TechnicalSupport.API.Interfaces
{
    public interface IModeloService
    {
        public Task<ApiResponse> AddAsync(Modelo modelo);
        public Task<ApiResponse> DeleteAsync(int userId, int id);
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<ApiResponse> UpdateAsync(int id, Modelo modelo);
    }
}
