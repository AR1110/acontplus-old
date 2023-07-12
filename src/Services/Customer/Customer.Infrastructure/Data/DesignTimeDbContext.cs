using Customer.Infrastructure.Data;
using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Customer.Infrastructure.Data
{
    //to execute migrations from api
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<CustomerContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Customer.Infrastructure";

        public CustomerContext CreateDbContext(string[] args)
        {

            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Staging.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Production.json", optional: true, reloadOnChange: true)
                .Build(); 

            var connectionString = Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString(_databaseName));

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<CustomerContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new CustomerContext(dbContextOptionsBuilder.Options);
        }
    }
}