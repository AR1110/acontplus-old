using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Mechanical.API.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<MechanicalContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Mechanical.API";

        public MechanicalContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                                .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<MechanicalContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new MechanicalContext(dbContextOptionsBuilder.Options);
        }

    }
}
