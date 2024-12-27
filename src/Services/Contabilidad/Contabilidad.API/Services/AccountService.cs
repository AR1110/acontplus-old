using Common.AppSettings;

namespace Contabilidad.API.Services
{
    public class AccountService(ContabilidadContext context, IAdoRepository repository) : IAccountService
    {

        public async Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await repository.GetDataSetAsync("Contabilidad.Account_Get", parameters);
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new LegacyApiResponse { code = "0", message = "Data not found" };
            }

            return new LegacyApiResponse { code = "1", payload = DataConverters.DataSetToJson(ds) };
        }

        public async Task<LegacyApiResponse> AddAsync(Account account)
        {
            if (await context.Subcategories.AnyAsync(x => (x.Code == account.Code)))
            {
                return new LegacyApiResponse { code = "0", message = "Código ya existe" };
            }

            context.Accounts.Add(account);
            await context.SaveChangesAsync();
            return new LegacyApiResponse { code = "1", message = "Registrada exitosamente" };
        }

        public async Task<LegacyApiResponse> UpdateAsync(int id, Account account)
        {
            var accountFound = await context.Accounts.FindAsync(id);
            if (accountFound == null)
            {
                return new LegacyApiResponse { code = "0", message = "Cuenta no encontrada" };
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
            return new LegacyApiResponse { code = "1", message = "Actualizada exitosamente" };
        }

        public async Task<LegacyApiResponse> DeleteAsync(int userId, int id)
        {
            var account = await context.Accounts.FirstOrDefaultAsync(x => x.Id == id);
            if (account == null)
            {
                return new LegacyApiResponse { code = "0", message = "Cuenta no encontrada" };
            }

            account.Enabled = false;
            account.Deleted = true;
            account.UserId = userId;
            context.Update(account);
            await context.SaveChangesAsync();
            return new LegacyApiResponse { code = "1", message = "Eliminada exitosamente" };
        }
    }
}
