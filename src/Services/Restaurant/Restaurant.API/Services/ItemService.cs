using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository.Interfaces;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ItemService(IAdoRepository adoRepository) : IItemService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_Get", parameters);

            return DataValidation.DataSetIsNull(ds, true)
                ? new ApiResponse { Code = "0", Message = "Data not found" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }

        public async Task<ApiResponse> GetByIdAsync(int id)
        {
            var parameters = new Dictionary<string, object> { { "id", id }, };
            var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_GetById", parameters);
            return DataValidation.DataSetIsNull(ds, true)
                ? new ApiResponse { Code = "0", Message = "Data not found" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }

        public async Task<ApiResponse> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", request.UserRoleId },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Item_Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", request.UserRoleId }, { "id", id } };
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Item_Update_Cancel", request.Data);
        }
    }
}
