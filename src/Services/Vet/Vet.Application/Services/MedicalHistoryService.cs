using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Vet.Core.Interfaces;

namespace Vet.Application.Services
{
    public class MedicalHistoryService : IMedicalHistory
    {
        private readonly IADORepository _generic;
        private readonly IReportService _report;
        private readonly APIResponse _response;
        public MedicalHistoryService(IADORepository genericRepository, IReportService report)
        {
            _response = new APIResponse();
            _generic = genericRepository;
            _report = report;
        }
        public async Task<APIResponse> GetAsync(Dictionary<string, object> parameters)
        {
            //var sqlParam = new SqlParameter("@json", Converters.SerializeDictionary(parameters.Data));
            //var result = _context.MedicalHistories.FromSqlRaw($"Pet.MedicalHistory_Get {sqlParam}");
            var dt = await _generic.GetDataTableAsync("Pet.MedicalHistory_Get", parameters);

            if (DataValidation.DataTableIsNull(dt))
            {
                _response.Create(code: "0", "La transacción no devolvio respuesta");
            }
            else
            {
                _response.Create(code: "1", payload: DataConverters.DataTableToJSON(dt));
            }
            return _response;
        }
        public async Task<APIResponse> GetByIdAsync(int id)
        {
            var parameters = new Dictionary<string, object>()
            {
                {"id", id}
            };
            var ds = await _generic.GetDataSetAsync("Pet.MedicalHistory_GetById", parameters);

            if (DataValidation.DataTableIsNull(ds.Tables[0]))
            {
                _response.Create(code: "0", "La transacción no devolvio respuesta");
            }
            else
            {
                _response.Create(code: "1", payload: DataConverters.DataSetToJSON(ds));
            }
            return _response;
        }
        //public async Task<APIResponse> AddAsync(MedicalHistory medicalHistory)
        //{
        //    return _response;
        //}
        //public async Task<APIResponse> UpdateAsync(int id, MedicalHistory medicalHistory)
        //{
        //    return _response;
        //}
        //public async Task<APIResponse> DeleteAsync(int id)
        //{
        //    return _response;
        //}

        public async Task<ReportResponse> GetReportAsync(Dictionary<string, object> parameters)
        {
            var ds = await _generic.GetDataSetAsync("Pet.MedicalHistory_Report", parameters);
            return _report.GetReportNew(ds);
        }
    }
}
