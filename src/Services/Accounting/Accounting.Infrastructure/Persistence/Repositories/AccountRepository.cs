namespace Accounting.Infrastructure.Persistence.Repositories;

public class AccountRepository(AccountingContext context, IAdoRepository repository) : IAccountRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.Account_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Account account)
    {
        if (await context.Subcategories.AnyAsync(x => x.Code == account.Code))
            return new SpResponse { Code = "0", Message = "Código ya existe" };

        context.Accounts.Add(account);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrada exitosamente" };
    }

    public async Task<SpResponse> UpdateAsync(int id, Account account)
    {
        var accountFound = await context.Accounts.FindAsync(id);
        if (accountFound == null) return new SpResponse { Code = "0", Message = "Cuenta no encontrada" };
        accountFound.TipoId = account.TipoId;
        accountFound.Code = account.Code;
        accountFound.Name = account.Name;
        accountFound.Hierarchy = account.Hierarchy;
        accountFound.Level = account.Level;
        accountFound.IsActive = account.IsActive;
        accountFound.UpdatedByUserId = account.UpdatedByUserId;
        context.Update(accountFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var account = await context.Accounts.FirstOrDefaultAsync(x => x.Id == id);
        if (account == null) return new SpResponse { Code = "0", Message = "Cuenta no encontrada" };

        account.MarkAsDeleted(userId);
        context.Update(account);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }
}
