using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Identity.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Identity.Infrastructure";

        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Restaurant.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new ApplicationDbContext(dbContextOptionsBuilder.Options);
        }
    }
}
