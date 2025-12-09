namespace Vet.Infrastructure.Persistence.Repositories;

public class BreedRepository(VetContext context) : IBreedRepository
{
    public async Task<SpResponse> AddAsync(Breed breed)
    {
        context.Breeds.Add(breed);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado exitosamente", Payload = breed };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var breed = await context.Breeds.FindAsync(id);
        if (breed == null) return new SpResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        breed.MarkAsDeleted(userId);
        context.Update(breed);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<SpResponse> GetAsync()
    {
        var response = await context.Breeds.AsNoTracking().Include(t => t.PetType).Where(x => !x.IsDeleted).ToListAsync();
        return response.Count > 0 ? new SpResponse { Code = "1", Payload = response } : new SpResponse { Code = "0", Message = "No data!" };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var breed = await context.Breeds.FindAsync(id);
        return breed == null
            ? new SpResponse { Code = "0", Message = "No se encontro raza para actualizar" }
            : new SpResponse { Code = "1", Payload = breed };
    }

    public async Task<SpResponse> UpdateAsync(int id, Breed breed)
    {
        var breedFound = await context.Breeds.FindAsync(id);
        if (breedFound == null) return new SpResponse { Code = "0", Message = "No se encontro raza para actualizar" };

        breedFound.PetTypeId = breed.PetTypeId;
        breedFound.Code = breed.Code;
        breedFound.Name = breed.Name;
        breedFound.Description = breed.Description;
        breedFound.IsActive = breed.IsActive;
        breedFound.UpdatedByUserId = breed.UpdatedByUserId;
        context.Update(breedFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente", Payload = breed };
    }
}
