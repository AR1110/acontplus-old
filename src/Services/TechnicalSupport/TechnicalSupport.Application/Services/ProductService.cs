using Common.Infrastructure.Repository;
using Lib.Common;
using TechnicalSupport.Core.Interfaces;

namespace TechnicalSupport.Application.Services
{
    public class ProductService: IProductService
    {
        private readonly IADORepository _repository;
        public ProductService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupportContext", "TechnicalSupport.Product_Get", parameters);
            if (ds == null)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
    }
}
