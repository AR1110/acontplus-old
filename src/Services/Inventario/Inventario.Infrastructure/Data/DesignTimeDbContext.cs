using Lib.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Inventario.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<InventarioContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Inventario.Infrastructure";

        public InventarioContext CreateDbContext(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Staging.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Production.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString(_databaseName));

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<InventarioContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new InventarioContext(dbContextOptionsBuilder.Options);
        }
    }
}