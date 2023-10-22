using Common.Infrastructure.Repository;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Application.Services
{
    public class PetService : IPetService
    {
        private readonly VetContext _context;
        private readonly IADORepository _repository;
        private readonly APIResponse _response;
        public PetService(VetContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
            _response = new APIResponse();
        }
        public async Task<APIResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Pet.Pet_Get", parameters);
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
        public async Task<Pet> GetByIdAsync(int id)
        {
            var response = await _context.Pets.SingleOrDefaultAsync(x => x.Id == id);
            return response;
        }
        public async Task<Pet> AddAsync(Pet recipe)
        {
            await _context.Pets.AddAsync(recipe);
            _context.SaveChanges();
            return recipe;
        }
        public Pet UpdateAsync(Pet recipe)
        {
            _context.Pets.Update(recipe);
            _context.SaveChanges();
            return recipe;
        }
        public void RemoveAsync(Pet recipe)
        {
            _context.Pets.Remove(recipe);
            _context.SaveChanges();
        }

        public async Task<APIResponse> SearchAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Pet.Pet_Get", parameters);
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
    }
}
