using Microsoft.EntityFrameworkCore;
using Vet.Core.Entities;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Application.Services
{
    public class PetService : IPet
    {
        private readonly VetContext _context;
        public PetService(VetContext context)
        {
            _context = context;
        }
        public async Task<List<Pet>> GetAsync()
        {
            var response = await _context.Pets.ToListAsync();
            return response;
        }
        public async Task<Pet> GetByIdAsync(int id)
        {
            var response = await _context.Pets.SingleOrDefaultAsync(x => x.Id == id);
            return response;
        }
        public async Task<Pet> CreateAsync(Pet recipe)
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
    }
}