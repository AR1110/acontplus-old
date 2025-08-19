namespace Vet.API.Services;

public class PetTypeService(VetContext context) : IPetTypeService
{
    public async Task<ApiResponse> AddAsync(PetType petType)
    {
        context.PetTypes.Add(petType);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado exitosamente", Payload = petType };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var petType = await context.PetTypes.FindAsync(id);
        if (petType == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        petType.MarkAsDeleted(userId);
        context.Update(petType);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync()
    {
        var response = await context.PetTypes.Where(x => !x.IsDeleted).ToListAsync();
        if (response.Count > 0) return new ApiResponse { Code = "1", Payload = response };

        return new ApiResponse { Code = "0", Message = "No data!" };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var petType = await context.PetTypes.FindAsync(id);
        if (petType == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para actualizar" };

        return new ApiResponse { Code = "1", Payload = petType };
    }

    public async Task<ApiResponse> UpdateAsync(int id, PetType petType)
    {
        var petTypeFound = await context.PetTypes.FindAsync(id);
        if (petTypeFound == null)
            return new ApiResponse { Code = "0", Message = "No se encontro raza para actualizar" };

        petTypeFound.Code = petType.Code;
        petTypeFound.Name = petType.Name;
        petTypeFound.Description = petType.Description;
        petTypeFound.UpdatedByUserId = petType.UpdatedByUserId;
        context.Update(petTypeFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente", Payload = petType };
    }
}
