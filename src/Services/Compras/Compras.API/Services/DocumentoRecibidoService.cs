using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Compras.API.Interfaces;

namespace Compras.API.Services
{
    public class DocumentoRecibidoService: IDocumentoRecibidoService
    {
        private readonly IADORepository _repository;
        public DocumentoRecibidoService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Recepcion.Documento_Get", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds);
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{ 
                {"userRoleId", request.UserRoleId},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
            };
            return await _repository.SPExecuteAsync("Recepcion.Documento_Insert", parameters);

        }

        //public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        //{
        //    var ds = await _repository.GetDataSetAsync("Compra.Liquidacion_Get_Id", parameters, true);
        //    if (ds.Tables[0].Rows.Count == 0) { return null; }
        //    return DataConverters.DataSetToJSON(ds, true);
        //}

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Compra.Documento_Ingreso_Update", parameters);

        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Compra.Documento_Ingreso_Delete", parameters);

        }

        //public async Task<string> DocumentoCheckExistence(Dictionary<string, object> parameters)
        //{
        //    return await _repository.SPExecuteAsync("Recepcion.Documento_Check_Existence", parameters);
            
        //}

    }
}
