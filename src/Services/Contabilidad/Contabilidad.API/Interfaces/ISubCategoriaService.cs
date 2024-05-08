namespace Contabilidad.API.Interfaces
{
    public interface ISubCategoriaService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> InsertAsync(Subcategory data);
    }
}
