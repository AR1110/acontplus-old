using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Vet.Core.Entities;

namespace Vet.Infrastructure.Data
{
    public class VetContext : DbContext
    {
        public VetContext(DbContextOptions<VetContext> options) : base(options)
        {

        }
        public DbSet<PetType> PetTypes { get; set; }
        public DbSet<PetBreed> PetBreeds { get; set; }
        public DbSet<PetSex> PetSexs { get; set; }
        public DbSet<Pet> Pets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                    foreach (var property in properties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                }
                // Force all string-based columns to non-unicode equivalent 
                // when no column type is explicitly set.
                foreach (var property in modelBuilder.Model.GetEntityTypes()
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
            }

            modelBuilder.Entity<PetType>().ToTable("PetType", schema: "Pet");
            modelBuilder.Entity<PetBreed>().ToTable("PetBreed", schema: "Pet");
            modelBuilder.Entity<PetSex>().ToTable("PetSex", schema: "Pet");
            modelBuilder.Entity<Pet>().ToTable("Pet", schema: "Pet");

        }
    }
}