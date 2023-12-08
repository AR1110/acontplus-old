using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TechnicalSupport.API.Data
{
    //to execute migrations from api
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<TechnicalSupportContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "TechnicalSupport.API";

        public TechnicalSupportContext CreateDbContext(string[] args)
        {

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<TechnicalSupportContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new TechnicalSupportContext(dbContextOptionsBuilder.Options);
        }
    }
}
