using Microsoft.EntityFrameworkCore.Design;

namespace Common.API.Data;

//to execute migrations from api
public class DesignTimeDbContext : IDesignTimeDbContextFactory<CommonContext>
{
    private const string DatabaseName = "DefaultConnection";
    private const string MigrationAssembly = "Common.API";

    public CommonContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine("C:\\Acontplus\\", "Shared")) //old ../Vet.API
            .AddJsonFile("sharedsettings.Development.json", true, true)
            .Build();

        var connectionString = configuration.GetConnectionString(DatabaseName);

        var dbContextOptionsBuilder = new DbContextOptionsBuilder<CommonContext>()
            .UseSqlServer(connectionString, x => x.MigrationsAssembly(MigrationAssembly));

        return new CommonContext(dbContextOptionsBuilder.Options);
    }
}
