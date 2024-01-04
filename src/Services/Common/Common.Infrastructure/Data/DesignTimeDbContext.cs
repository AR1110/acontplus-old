using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<CommonContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Common.API";

        public CommonContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            IConfiguration configuration = new ConfigurationBuilder()
                                .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Restaurant.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<CommonContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new CommonContext(dbContextOptionsBuilder.Options);
        }
    }
}
