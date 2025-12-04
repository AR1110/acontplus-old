namespace Vet.Infrastructure.Persistence.Repositories;

public class PetRepository(VetContext context, IAdoRepository repository) : IPetRepository
{
    public async Task<SpResponse> AddAsync(Pet pet)
    {
        await context.Pets.AddAsync(pet);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Guardada exitosamente", Payload = pet };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var pet = await context.Pets.FindAsync(id);
        if (pet == null) return new SpResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        pet.MarkAsDeleted(userId);
        context.Update(pet);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Vet.Pet_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var pet = await context.Pets.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        return new SpResponse { Code = "1", Payload = pet };
    }


    public async Task<SpResponse> UpdateAsync(int id, Pet pet)
    {
        var petFound = await context.Pets.SingleOrDefaultAsync(x => x.Id == id);
        if (petFound == null) return new SpResponse { Code = "0", Message = "No se encontro mascota para editar" };

        petFound.UpdatedByUserId = pet.UpdatedByUserId;
        petFound.Name = pet.Name;
        petFound.BreedId = pet.BreedId;
        petFound.GenderId = pet.GenderId;
        petFound.Color = pet.Color;
        petFound.IsActive = pet.IsActive;
        petFound.Birthdate = pet.Birthdate;
        context.Pets.Update(petFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada exitosamente", Payload = pet };
    }


    public async Task<SpResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Vet.Pet_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
