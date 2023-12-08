using System.Reflection;
using Common.Core.Entities;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Vet.API.Entities;


namespace Vet.API.Data
{
    public class VetContext : BaseContext
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
            //modelBuilder.Entity<t>().ToTable("TableName", schema: "Schema")
            modelBuilder.Entity<PetType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<PetType>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<PetType>().HasIndex(x => x.Code).HasDatabaseName("UI_PetType").IsUnique();


            modelBuilder.Entity<Breed>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Breed>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<Breed>().HasIndex(x => x.Code).HasDatabaseName("UI_Breed").IsUnique();


            modelBuilder.Entity<Gender>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Gender>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<Gender>().HasIndex(x => x.Code).HasDatabaseName("UI_Gender").IsUnique();


            modelBuilder.Entity<Pet>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Pet>().Property(x => x.Enabled).HasDefaultValue(true);

            modelBuilder.Entity<DiseaseStatus>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<DiseaseStatus>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<DiseaseStatus>().HasIndex(x => x.Code).HasDatabaseName("UI_DiseaseStatus").IsUnique();


            modelBuilder.Entity<DiseaseType>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()"); ;
            modelBuilder.Entity<DiseaseType>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<DiseaseType>().HasIndex(x => x.Code).HasDatabaseName("UI_DiseaseType").IsUnique();

            modelBuilder.Entity<Disease>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Disease>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<Disease>().HasIndex(x => x.Code).HasDatabaseName("UI_Disease").IsUnique();


            modelBuilder.Entity<HealthCheck>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<HealthCheck>().Property(x => x.Enabled).HasDefaultValue(true);

            modelBuilder.Entity<BehaviorStatus>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<BehaviorStatus>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<BehaviorStatus>().HasIndex(x => x.Code).HasDatabaseName("UI_BehaviorStatus").IsUnique();


            modelBuilder.Entity<Behavior>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<Behavior>().Property(x => x.Enabled).HasDefaultValue(true);
            modelBuilder.Entity<Behavior>().HasIndex(x => x.Code).HasDatabaseName("UI_Behavior").IsUnique();


            modelBuilder.Entity<BehaviorTest>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<BehaviorTest>().Property(x => x.Enabled).HasDefaultValue(true);

            modelBuilder.Entity<MedicalHistory>()
           .HasMany(i => i.HealthChecks)
           .WithOne(d => d.MedicalHistory)
           .HasForeignKey(d => d.MedicalHistoryId);

            modelBuilder.Entity<MedicalHistory>()
           .HasMany(i => i.BehaviorTests)
           .WithOne(d => d.MedicalHistory)
           .HasForeignKey(d => d.MedicalHistoryId);

            modelBuilder.Entity<MedicalHistory>().Property(p => p.CreatedAt).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<MedicalHistory>().Property(x => x.Enabled).HasDefaultValue(true);

        }

        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
                }

                //if (entityEntry.State == EntityState.Added)
                //{
                //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
                //}
            }

            return base.SaveChanges();
        }
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
                }
                //if (entityEntry.State == EntityState.Added)
                //{
                //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
                //}
            }
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }

    }
}
