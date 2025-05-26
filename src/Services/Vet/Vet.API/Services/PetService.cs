namespace Vet.API.Services;

public class PetService(VetContext context, IAdoRepository repository) : IPetService
{
    public async Task<ApiResponse> AddAsync(Pet pet)
    {
        await context.Pets.AddAsync(pet);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada exitosamente", Payload = pet };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var pet = await context.Pets.FindAsync(id);
        if (pet == null) return new ApiResponse { Code = "0", Message = "No se encontro raza para eliminar" };

        pet.UserId = userId;
        pet.Deleted = true;
        pet.IsActive = false;
        context.Update(pet);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Vet.Pet_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
            return new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var pet = await context.Pets.SingleOrDefaultAsync(x => x.Id == id);
        return new ApiResponse { Code = "1", Payload = pet };
    }


    public async Task<ApiResponse> UpdateAsync(int id, Pet pet)
    {
        var petFound = await context.Pets.SingleOrDefaultAsync(x => x.Id == id);
        if (petFound == null) return new ApiResponse { Code = "0", Message = "No se encontro mascota para editar" };

        petFound.UserId = pet.UserId;
        petFound.Name = pet.Name;
        petFound.BreedId = pet.BreedId;
        petFound.GenderId = pet.GenderId;
        petFound.Color = pet.Color;
        petFound.IsActive = pet.IsActive;
        petFound.Birthdate = pet.Birthdate;
        context.Pets.Update(petFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada exitosamente", Payload = pet };
    }


    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Vet.Pet_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
            return new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}