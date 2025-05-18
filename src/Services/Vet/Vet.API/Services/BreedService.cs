namespace Vet.API.Services;

public class BreedService(VetContext context) : IBreedService
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

        breed.UserId = userId;
        breed.Deleted = true;
        breed.Enabled = false;
        context.Update(breed);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync()
    {
        var response = await context.Breeds.Include(t => t.PetType).Where(x => x.Deleted == null).ToListAsync();
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
        breedFound.Enabled = breed.Enabled;
        breedFound.UserId = breed.UserId;
        context.Update(breedFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente", Payload = breed };
    }
}