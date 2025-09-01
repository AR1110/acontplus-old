using System.Reflection;

namespace Vet.Infrastructure.Persistence;

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

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        // Force all string-based columns to non-unicode equivalent 
        // when no column type is explicitly set.
        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                     ))
            property.SetIsUnicode(false);


        SimpleEntityRegistration.RegisterEntities(modelBuilder, typeof(VetContext),
            typeof(BehaviorTest),
            typeof(HealthCheck),
            typeof(Pet)
        );
    }
}