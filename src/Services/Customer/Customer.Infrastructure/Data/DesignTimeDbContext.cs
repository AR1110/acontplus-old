using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Customer.Infrastructure.Data
{
    public class DesignTimeDbContext : IDesignTimeDbContextFactory<CustomerContext>
    {
        private const string _databaseName = "DefaultConnection";
        private const string _migrationAssembly = "Customer.Infrastructure";

        public CustomerContext CreateDbContext(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Customer.API"))
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.Development.json")
                .Build();

            var connectionString = configuration.GetConnectionString(_databaseName);

            var dbContextOptionsBuilder = new DbContextOptionsBuilder<CustomerContext>()
                .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

            return new CustomerContext(dbContextOptionsBuilder.Options);
        }
    }
}
