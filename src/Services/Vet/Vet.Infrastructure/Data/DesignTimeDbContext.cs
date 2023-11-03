using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Vet.Infrastructure.Data
{
    //to execute migrations from api
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<VetContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Vet.Infrastructure";

        public VetContext CreateDbContext(string[] args)
        {

            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Vet.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<VetContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new VetContext(dbContextOptionsBuilder.Options);
        }
    }
}
