using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Vet.API.Data
{
    //to execute migrations from api
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<VetContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Vet.API";

        public VetContext CreateDbContext(string[] args)
        {

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                                .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<VetContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new VetContext(dbContextOptionsBuilder.Options);
        }
    }
}
