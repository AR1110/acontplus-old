using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Infrastructure.Entity;

public abstract class BaseEntityTypeConfiguration<TEntity> : IEntityTypeConfiguration<TEntity> where TEntity : class
{
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        // Default configuration for all entities
        builder.HasKey("Id");

        // Configure common properties
        if (typeof(TEntity).GetProperty("CreatedAt") != null)
        {
            builder.Property("CreatedAt").HasDefaultValueSql("GETDATE()");
        }

        if (typeof(TEntity).GetProperty("UpdatedAt") != null)
        {
            builder.Property("UpdatedAt").HasDefaultValueSql("GETDATE()");
        }

        if (typeof(TEntity).GetProperty("IsActive") != null)
        {
            builder.Property("IsActive").HasDefaultValue(true);
        }

        if (typeof(TEntity).GetProperty("IsDeleted") != null)
        {
            builder.Property("IsDeleted").HasDefaultValue(false);
        }
    }
}
