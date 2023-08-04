using Lib.Common;
using Lib.Common.Api;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Application.Services
{
    public class AppProductionAreaService: IAppProductionAreaService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly APIResponse _response;

        public AppProductionAreaService(IADORepository repository)
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
    }
}
