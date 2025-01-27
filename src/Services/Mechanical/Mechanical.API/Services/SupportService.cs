using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository.Interfaces;
using Mechanical.API.Data;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services
{
    public class SupportService(MechanicalContext _context, IAdoRepository _repository) : ISupportService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Mechanical.Support_Get", parameters);
            return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }
        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.Support_Insert", parameters);
        }
        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.Support_Update", parameters);
        }
        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.Support_Delete", parameters);
        }

        public async Task<ApiResponse> UpdateStateAsync(int id, int SupportStatusId)
        {
            var support = await _context.Supports.FindAsync(id);
            if (support == null)
            {
                return new ApiResponse { Code = "0", Message = "No se encontro Orden para actualizar" };
            }
            support.SupportStatusId = SupportStatusId;
            _context.Update(support);
            await _context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Actualizado exitosamente", Payload = null };
        }
    }
}
