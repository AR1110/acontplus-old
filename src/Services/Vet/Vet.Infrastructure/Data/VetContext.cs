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
        public DbSet<Breed> Breeds { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<DiseaseStatus> DiseaseStatuses { get; set; }
        public DbSet<DiseaseType> DiseaseTypes { get; set; }
        public DbSet<Disease> Diseases { get; set; }
        public DbSet<HealthCheck> HealthChecks { get; set; }
        public DbSet<BehaviorStatus> BehaviorStatuses { get; set; }
        public DbSet<Behavior> Behaviors { get; set; }
        public DbSet<BehaviorTest> BehaviorTests { get; set; }
        public DbSet<MedicalHistory> MedicalHistories { get; set; }

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
            modelBuilder.Entity<Breed>().ToTable("Breed", schema: "Pet");
            modelBuilder.Entity<Gender>().ToTable("Gender", schema: "Pet");
            modelBuilder.Entity<Pet>().ToTable("Pet", schema: "Pet");
            modelBuilder.Entity<DiseaseStatus>().ToTable("DiseaseStatus", schema: "Pet");
            modelBuilder.Entity<DiseaseType>().ToTable("DiseaseType", schema: "Pet");
            modelBuilder.Entity<Disease>().ToTable("Disease", schema: "Pet");
            modelBuilder.Entity<HealthCheck>().ToTable("HealthCheck", schema: "Pet");
            modelBuilder.Entity<BehaviorStatus>().ToTable("BehaviorStatus", schema: "Pet");
            modelBuilder.Entity<Behavior>().ToTable("Behavior", schema: "Pet");
            modelBuilder.Entity<BehaviorTest>().ToTable("BehaviorTest", schema: "Pet");
            modelBuilder.Entity<MedicalHistory>().ToTable("MedicalHistory", schema: "Pet");

        }
    }
}