namespace FactElect.Application.Services;

public class CustomerService(IAdoRepository adoRepository) : ICustomerService
{
    //public async Task<SpResponse> AddAsync(AppCustomer customer)
    //{
    //    await context.Customers.AddAsync(customer);
    //    await context.SaveChangesAsync();
    //    return new SpResponse
    //    {
    //        Code = "1",
    //        Message = "Registrado exitosamente",
    //        Payload = DataConverters.SerializeObjectCustom<AppCustomer>(customer)
    //    };
    //}

    //public async Task<SpResponse> DeleteAsync(int userId, int id)
    //{
    //    var customer = await context.Customers.FindAsync(id);
    //    if (customer == null) return new SpResponse { Code = "0", Message = "Item no encontrado" };

    //    customer.MarkAsDeleted(userId);
    //    context.Update(customer);
    //    await context.SaveChangesAsync();
    //    return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    //}

    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }

    public async Task<DataTable> GetByIdCardAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Customer.Customer_IDCard_Get", parameters);
        return ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
    }

    //public async Task<SpResponse> UpdateAsync(int id, AppCustomer customer)
    //{
    //    context.Update(customer);
    //    await context.SaveChangesAsync();
    //    return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    //}
}
