using Microsoft.EntityFrameworkCore.Design;

namespace FactElect.API.Data;

public class DesignTimeDbContext : IDesignTimeDbContextFactory<FactElectContext>
{
    private const string _databaseName = "DefaultConnection";
    private const string _migrationAssembly = "FactElect.API";

    public FactElectContext CreateDbContext(string[] args)
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Restaurant.API
            .AddJsonFile("sharedsettings.Development.json", true, true)
            .Build();

        var connectionString = configuration.GetConnectionString(_databaseName);

        var dbContextOptionsBuilder = new DbContextOptionsBuilder<FactElectContext>()
            .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

        return new FactElectContext(dbContextOptionsBuilder.Options);
    }
}
