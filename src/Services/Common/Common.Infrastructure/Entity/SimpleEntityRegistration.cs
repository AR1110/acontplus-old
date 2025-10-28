namespace Common.Infrastructure.Entity;

public static class SimpleEntityRegistration
{
    public static void RegisterEntities(ModelBuilder modelBuilder, Type contextType, params Type[] entityTypes)
    {
        foreach (var entityType in entityTypes)
        {
            modelBuilder.Entity(entityType);
        }
    }

    public static void RegisterEntitiesWithSchemas(ModelBuilder modelBuilder, Type contextType, params (Type entityType, string schema)[] entitySchemaPairs)
    {
        foreach (var (entityType, schema) in entitySchemaPairs)
        {
            modelBuilder.Entity(entityType).ToTable(entityType.Name, schema);
        }
    }
}
