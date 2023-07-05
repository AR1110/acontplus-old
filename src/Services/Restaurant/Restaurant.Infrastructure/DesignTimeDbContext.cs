using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Restaurant.Infrastructure.Data;
using Microsoft.Extensions.Configuration;

namespace Restaurant.Infrastructure.Extensions
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<RestaurantContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Restaurant.Infrastructure";

        public RestaurantContext CreateDbContext(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Restaurant.API"))
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.Development.json")
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<RestaurantContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new RestaurantContext(dbContextOptionsBuilder.Options);
        }
    }
}
