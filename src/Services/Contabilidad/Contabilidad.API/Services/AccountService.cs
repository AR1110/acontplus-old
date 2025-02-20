using Common.AppSettings;

namespace Contabilidad.API.Services
{
    public class AccountService(ContabilidadContext context, IAdoRepository repository) : IAccountService
    {

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await repository.GetDataSetAsync("Contabilidad.Account_Get", parameters);
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new ApiResponse { Code = "0", Message = "Data not found" };
            }

            return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }

        public async Task<ApiResponse> AddAsync(Account account)
        {
            if (await context.Subcategories.AnyAsync(x => (x.Code == account.Code)))
            {
                return new ApiResponse { Code = "0", Message = "Código ya existe" };
            }

            context.Accounts.Add(account);
            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Registrada exitosamente" };
        }

        public async Task<ApiResponse> UpdateAsync(int id, Account account)
        {
            var accountFound = await context.Accounts.FindAsync(id);
            if (accountFound == null)
            {
                return new ApiResponse { Code = "0", Message = "Cuenta no encontrada" };
            }
            accountFound.TipoId = account.TipoId;
            accountFound.Code = account.Code;
            accountFound.Name = account.Name;
            accountFound.Hierarchy = account.Hierarchy;
            accountFound.Level = account.Level;
            accountFound.Enabled = account.Enabled;
            accountFound.UserId = account.UserId;
            context.Update(accountFound);
            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Actualizada exitosamente" };
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            var account = await context.Accounts.FirstOrDefaultAsync(x => x.Id == id);
            if (account == null)
            {
                return new ApiResponse { Code = "0", Message = "Cuenta no encontrada" };
            }

            account.Enabled = false;
            account.Deleted = true;
            account.UserId = userId;
            context.Update(account);
            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
        }
    }
}
