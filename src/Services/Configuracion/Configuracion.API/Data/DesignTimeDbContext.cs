using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Configuracion.API.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<ConfigContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Configuracion.API";

        public ConfigContext CreateDbContext(string[] args)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                                .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared"))
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<ConfigContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new ConfigContext(dbContextOptionsBuilder.Options);
        }
    }
}
