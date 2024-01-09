using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Contabilidad.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<ContabilidadContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Contabilidad.Infrastructure";

        public ContabilidadContext CreateDbContext(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                                .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<ContabilidadContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new ContabilidadContext(dbContextOptionsBuilder.Options);
        }
    }
}
