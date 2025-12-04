namespace Vet.Infrastructure.Persistence.Repositories;

public class PetTypeRepository(VetContext context) : IPetTypeRepository
{
    public async Task<SpResponse> AddAsync(PetType petType)
    {
        context.PetTypes.Add(petType);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado exitosamente", Payload = petType };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var petType = await context.PetTypes.FindAsync(id);
        if (petType == null) return new SpResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        petType.MarkAsDeleted(userId);
        context.Update(petType);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<SpResponse> GetAsync()
    {
        var response = await context.PetTypes.AsNoTracking().Where(x => !x.IsDeleted).ToListAsync();
        return response.Count > 0 ? new SpResponse { Code = "1", Payload = response } : new SpResponse { Code = "0", Message = "No data!" };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var petType = await context.PetTypes.FindAsync(id);
        return petType == null
            ? new SpResponse { Code = "0", Message = "No se encontro raza para actualizar" }
            : new SpResponse { Code = "1", Payload = petType };
    }

    public async Task<SpResponse> UpdateAsync(int id, PetType petType)
    {
        var petTypeFound = await context.PetTypes.FindAsync(id);
        if (petTypeFound == null)
            return new SpResponse { Code = "0", Message = "No se encontro raza para actualizar" };

        petTypeFound.Code = petType.Code;
        petTypeFound.Name = petType.Name;
        petTypeFound.Description = petType.Description;
        petTypeFound.UpdatedByUserId = petType.UpdatedByUserId;
        context.Update(petTypeFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente", Payload = petType };
    }
}
