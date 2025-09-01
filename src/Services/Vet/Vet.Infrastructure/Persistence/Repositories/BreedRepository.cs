namespace Vet.Infrastructure.Persistence.Repositories;

public class BreedRepository(VetContext context) : IBreedRepository
{
    public async Task<ApiResponse> AddAsync(Breed breed)
    {
        context.Breeds.Add(breed);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado exitosamente", Payload = breed };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var breed = await context.Breeds.FindAsync(id);
        if (breed == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        breed.MarkAsDeleted(userId);
        context.Update(breed);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync()
    {
        var response = await context.Breeds.Include(t => t.PetType).Where(x => !x.IsDeleted).ToListAsync();
        if (response.Count > 0) return new ApiResponse { Code = "1", Payload = response };

        return new ApiResponse { Code = "0", Message = "No data!" };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var breed = await context.Breeds.FindAsync(id);
        if (breed == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para actualizar" };
        return new ApiResponse { Code = "1", Payload = breed };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Breed breed)
    {
        var breedFound = await context.Breeds.FindAsync(id);
        if (breedFound == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para actualizar" };

        breedFound.PetTypeId = breed.PetTypeId;
        breedFound.Code = breed.Code;
        breedFound.Name = breed.Name;
        breedFound.Description = breed.Description;
        breedFound.IsActive = breed.IsActive;
        breedFound.UpdatedByUserId = breed.UpdatedByUserId;
        context.Update(breedFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente", Payload = breed };
    }
}
