using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Configuracion.API.Services
{
    public class CompanyService: ICompanyService
    {
        private readonly IAdoRepository _repository;
        private readonly string nameSchema = "Config.Company_";

        public CompanyService(IAdoRepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }

            return DataConverters.DataSetToJson(ds);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync(nameSchema + "Update", parameters);
        }
    }
}
