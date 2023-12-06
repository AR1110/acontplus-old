using Common.Core.Interfaces;
using Common.Core.Utils;
using FactElect.Core.Interfaces;
using FactElect.Infrastructure.Data;

namespace FactElect.Application.Services
{
    public class DocumentoElectronicoErrorService : IDocumentoElectronicoErrorService
    {
        private readonly IADORepository _repository;

        public DocumentoElectronicoErrorService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("FactElect.Doc_Elect_Error_Get_Id", parameters);

            if (dt == null)
            {
                return null;
            }
            else
            {
                return DataConverters.DataTableToJSON(dt);
            }
        }
    }
}
