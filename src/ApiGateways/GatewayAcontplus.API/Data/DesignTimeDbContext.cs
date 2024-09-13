
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GatewayAcontplus.API.Data;

//to execute migrations from api
public class DesignTimeDbContext : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    private const string _databaseName = "OcelotGateway";
    private const string _migrationAssembly = "GatewayAcontplus.API";

    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        IConfiguration configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Development.json", true, true)
            .Build();

        var connectionString = configuration.GetConnectionString(_databaseName);

        var dbContextOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(connectionString, x => x.MigrationsAssembly(_migrationAssembly));

        return new ApplicationDbContext(dbContextOptionsBuilder.Options);
    }
}
