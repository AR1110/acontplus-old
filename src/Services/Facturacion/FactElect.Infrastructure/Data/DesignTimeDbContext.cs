using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FactElect.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<FactElectContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "FactElect.Infrastructure";

        public FactElectContext CreateDbContext(string[] args)
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../../../SharedSettings")) //old ../Restaurant.API
                .AddJsonFile($"sharedsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<FactElectContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new FactElectContext(dbContextOptionsBuilder.Options);
        }
    }
}
