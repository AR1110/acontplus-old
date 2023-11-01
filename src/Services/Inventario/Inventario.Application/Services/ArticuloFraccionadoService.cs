using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;

namespace Inventario.Application.Services
{
    public class ArticuloFraccionadoService: IArticuloFraccionadoService
    {
        private readonly IADORepository _repository;
        public ArticuloFraccionadoService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Inventario.Fraccionado_Get", parameters);

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
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Inventario.Fraccionado_Insert", parameters);
        }

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        { 
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Inventario.Fraccionado_Update", parameters);
        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {   
            return await _repository.SPExecuteAsync("Inventario.Fraccionado_Delete", parameters);
        }

    }
}
