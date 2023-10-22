using System.Data;
using Common.Infrastructure.Repository;
using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application.Services
{
    public class ProductionAreaService : IProductionAreaService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly APIResponse _response;

        public ProductionAreaService(IADORepository repository)
        {
            _repository = repository;
            _response = new APIResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Restaurant.ProductionArea_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", Converters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Restaurant.ProductionArea_Insert", parameters);
        }

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", Converters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Restaurant.ProductionArea_Update", request.Data);
        }

        public async Task<string> DeleteAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id}
            };
            return await _repository.SPExecuteAsync("Restaurant.ProductionArea_Update_Cancel", request.Data);
        }
    }
}
