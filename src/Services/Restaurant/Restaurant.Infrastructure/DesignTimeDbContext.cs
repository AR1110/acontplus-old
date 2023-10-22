using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Infrastructure
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<RestaurantContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Restaurant.Infrastructure";

        public RestaurantContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Restaurant.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Staging.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"sharedsettings.Production.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<RestaurantContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new RestaurantContext(dbContextOptionsBuilder.Options);
        }
    }
}
