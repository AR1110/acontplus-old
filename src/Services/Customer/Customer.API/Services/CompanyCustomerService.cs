using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Customer.API.Interfaces;

namespace Customer.API.Services
{
    public class CompanyCustomerService : ICompanyCustomerService
    {
        private readonly IADORepository _repository;
        public CompanyCustomerService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> AddAsync(Dictionary<string, object> data)
        {
            try
            {
                return await _repository.SPExecuteAsync("Ventas.Cliente_Insert", data);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<string> DeleteAsync(Dictionary<string, object> data)
        {
            try
            {
                return await _repository.SPExecuteAsync("Ventas.Cliente_Delete", data);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync("Ventas.Cliente_Get", parameters, true);
                if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new ApiResponse { code = "0", message = "No se encontraron clientes" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
        {
            try
            {
                var dt = await _repository.GetDataTableAsync("Ventas.Cliente_Get_Search", parameters);
                if (dt.Rows.Count == 0 || dt == null)
                {
                    return new ApiResponse { code = "0", message = "No se encontraron clientes con estos datos" };
                }
                return new ApiResponse {  code = "1", payload = DataConverters.DataTableToJSON(dt) };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> UpdateAsync(Dictionary<string, object> data)
        {
            try
            {
                return await _repository.SPExecuteAsync("Ventas.Cliente_Update", data);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
