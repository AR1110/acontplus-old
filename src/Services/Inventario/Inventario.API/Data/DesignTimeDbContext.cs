using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Inventario.API.Data;

public class DesignTimeDbContext : IDesignTimeDbContextFactory<InventarioContext>
{
    private const string _databaseName = "DefaultConnection";
    private const string _migrationAssembly = "Inventario.Infrastructure";

    public InventarioContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Vet.API
            .AddJsonFile("sharedsettings.Development.json", true, true)
            .Build();

        var connectionString = configuration.GetConnectionString(_databaseName);

        var dbContextOptionsBuilder = new DbContextOptionsBuilder<InventarioContext>()
            .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

        return new InventarioContext(dbContextOptionsBuilder.Options);
    }
}
