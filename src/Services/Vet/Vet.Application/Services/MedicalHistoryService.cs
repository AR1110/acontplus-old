using Lib.Common;
using Lib.Common.Api;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using Vet.Core.Entities;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Application.Services
{
    public class MedicalHistoryService : IMedicalHistory
    {
        private readonly VetContext _context;
        private readonly IGenericRepository _generic;
        private readonly APIResponse _response;
        public MedicalHistoryService(VetContext vetContext, IGenericRepository genericRepository)
        {
            _context = vetContext;
            _response = new APIResponse();
            _generic = genericRepository;
        }
        public async Task<APIResponse> Get(ApiRequest parameters)
        {
            //var sqlParam = new SqlParameter("@json", Converters.SerializeDictionary(parameters.Data));
            //var result = _context.MedicalHistories.FromSqlRaw($"Pet.MedicalHistory_Get {sqlParam}");
            var dt = await _generic.GetDataTable("Pet.MedicalHistory_Get", parameters.Data);

            if (DataValidation.DataTableIsNull(dt))
            {
                _response.Create(code: "0", "La transacción no devolvio respuesta");
            }
            else
            {
                _response.Create(code: "1", payload: Converters.DataTableToJSON(dt));
            }
            return _response;
        }
        public async Task<APIResponse> GetById(int id)
        {
            return _response;
        }
        public async Task<APIResponse> Insert(MedicalHistory medicalHistory)
        {
            return _response;
        }
        public async Task<APIResponse> Update(int id, MedicalHistory medicalHistory)
        {
            return _response;
        }
        public async Task<APIResponse> Delete(int id)
        {
            return _response;
        }
    }
}
