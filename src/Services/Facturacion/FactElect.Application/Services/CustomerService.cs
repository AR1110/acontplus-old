namespace FactElect.Application.Services;

public class CustomerService(FactElectContext context, IAdoRepository adoRepository) : ICustomerService
{
    public async Task<ApiResponse> AddAsync(AppCustomer customer)
    {
        await context.Customers.AddAsync(customer);
        await context.SaveChangesAsync();
        return new ApiResponse
        {
            Code = "1",
            Message = "Registrado exitosamente",
            Payload = DataConverters.SerializeObjectCustom<AppCustomer>(customer)
        };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null) return new ApiResponse { Code = "0", Message = "Item no encontrado" };

        customer.IsActive = false;
        customer.IsDeleted = true;
        customer.UserId = userId;
        context.Update(customer);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }

    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }

    public Task<DataTable> GetByIdCardAsync(Dictionary<string, object> parameters)
    {
        return adoRepository.GetDataTableAsync("Customer.Customer_IDCard_Get", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(int id, AppCustomer customer)
    {
        context.Update(customer);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}