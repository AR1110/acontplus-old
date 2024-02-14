using System.Reflection;
using Common.Infrastructure.Data;
using Identity.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Data
{
    public class ApplicationDbContext : BaseContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<ForgotPassword> ForgotPasswords { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }
        public DbSet<LoginFailed> LoginFaileds { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                foreach (var entityType in builder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                    foreach (var property in properties)
                    {
                        builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                }
                //Force all string-based columns to non - unicode equivalent
                //when no column type is explicitly set.
                foreach (var property in builder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)    // Entity is a string
                        && p.GetColumnType() == null           // No column type is set
                                                               // Next line only required if using ASP.Net Identity:
                        && p.DeclaringType.GetTableName().StartsWith("AspNet")
                    ))
                {
                    property.SetIsUnicode(false);
                }
            }

            builder.Entity<LoginHistory>().Property(p => p.LoginDate).HasDefaultValueSql("GETDATE()");
            builder.Entity<LoginHistory>().Property(x => x.IsLoggedIn).HasDefaultValue(true);

            builder.Entity<LoginFailed>().Property(p => p.ErrorDate).HasDefaultValueSql("GETDATE()");

            builder.Entity<ForgotPassword>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
        }
    }
}
