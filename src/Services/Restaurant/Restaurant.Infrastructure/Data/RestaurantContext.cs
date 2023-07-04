using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Restaurant.Infrastructure.Data
{
    public class RestaurantContext : DbContext
    {
        public RestaurantContext(DbContextOptions<RestaurantContext> options) : base(options)
        {

        }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeDetail> RecipeDetails { get; set; }
        public DbSet<Restaurants> Restaurants { get; set; }
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
            }

            foreach (var property in builder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)    // Entity is a string
                        && p.GetColumnType() == null           // No column type is set
                                                               // Next line only required if using ASP.Net Identity:
                        && !p.DeclaringEntityType.GetTableName().StartsWith("AspNet")
                    ))
            {
                property.SetIsUnicode(false);
            }

            // builder.Entity<AppUser>(entity =>
            // {
            //     entity.ToTable(name: "User");

            // });
            // builder.Entity<IdentityRole>(entity =>
            // {
            //     entity.ToTable(name: "Role");
            // });
            // builder.Entity<AppUserRole>(entity =>
            // {
            //     entity.ToTable(name: "UserRoles"); ;
            // });
            // builder.Entity<IdentityUserClaim<string>>(entity =>
            // {
            //     entity.ToTable("UserClaims");
            // });
            // builder.Entity<IdentityUserLogin<string>>(entity =>
            // {
            //     entity.ToTable("UserLogins");
            //     //in case you chagned the TKey type  
            //     //  entity.HasKey(key => new { key.ProviderKey, key.LoginProvider });         
            // });
            // builder.Entity<IdentityRoleClaim<string>>(entity =>
            // {
            //     entity.ToTable("RoleClaims");
            // });
            // builder.Entity<IdentityUserToken<string>>(entity =>
            // {
            //     entity.ToTable("UserTokens");
            //     //in case you chagned the TKey type  
            //     // entity.HasKey(key => new { key.UserId, key.LoginProvider, key.Name });  
            // });

            //builder.Entity<AppUser>()
            //   .HasMany(ur => ur.UserRoles)
            //   .WithOne(u => u.User)
            //   .HasForeignKey(ur => ur.UserId)
            //   .IsRequired();

            //builder.Entity<AppRole>()
            //    .HasMany(ur => ur.UserRoles)
            //    .WithOne(u => u.Role)
            //    .HasForeignKey(ur => ur.RoleId)
            //    .IsRequired();

            builder.ApplyUtcDateTimeConverter();

            builder.Entity<Recipe>().ToTable("Recipe", schema: "POS");
            builder.Entity<RecipeDetail>().ToTable("RecipeDetail", schema: "POS");
            builder.Entity<Restaurants>().ToTable("Restaurant", schema: "POS");
        }
    }
    public static class UtcDateAnnotation
    {
        private const String IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
          new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
          new ValueConverter<DateTime?, DateTime?>(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, Boolean isUtc = true) =>
          builder.HasAnnotation(IsUtcAnnotation, isUtc);

        public static Boolean IsUtc(this IMutableProperty property) =>
          ((Boolean?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc())
                    {
                        continue;
                    }

                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(UtcConverter);
                    }

                    if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(UtcNullableConverter);
                    }
                }
            }
        }
    }
}
