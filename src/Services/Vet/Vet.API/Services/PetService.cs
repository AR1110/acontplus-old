namespace Vet.API.Services;

public class PetService(VetContext context, IADORepository repository) : IPetService
{
    public async Task<ApiResponse> AddAsync(Pet pet)
    {
        await context.Pets.AddAsync(pet);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Guardada exitosamente", payload = pet };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var pet = await context.Pets.FindAsync(id);
        if (pet == null)
        {
            return new ApiResponse { code = "0", message = "No se encontro raza para eliminar" };
        }

        pet.UserId = userId;
        pet.Deleted = true;
        pet.Enabled = false;
        context.Update(pet);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Pet.Pet_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { code = "0", message = "La transacción no devolvio respuesta" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var pet = await context.Pets.SingleOrDefaultAsync(x => x.Id == id);
        return new ApiResponse { code = "1", payload = pet };
    }


    public async Task<ApiResponse> UpdateAsync(int id, Pet pet)
    {
        var petFound = await context.Pets.SingleOrDefaultAsync(x => x.Id == id);
        if (petFound == null)
        {
            return new ApiResponse { code = "0", message = "No se encontro mascota para editar" };
        }

        petFound.UserId = pet.UserId;
        petFound.Name = pet.Name;
        petFound.BreedId = pet.BreedId;
        petFound.GenderId = pet.GenderId;
        petFound.Color = pet.Color;
        petFound.Enabled = pet.Enabled;
        context.Pets.Update(petFound);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizada exitosamente", payload = pet };
    }


    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Pet.Pet_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { code = "0", message = "La transacción no devolvio respuesta" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }
}
