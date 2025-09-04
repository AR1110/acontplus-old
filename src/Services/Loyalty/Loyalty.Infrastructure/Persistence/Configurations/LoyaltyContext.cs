using Acontplus.Persistence.SqlServer.Configurations;
using Loyalty.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Acontplus.Persistence.SqlServer.Context;

namespace Loyalty.Infrastructure.Persistence.Configurations;

public class LoyaltyContext(DbContextOptions<LoyaltyContext> options) : BaseContext(options)
{
    public DbSet<LoyaltyTransaction> LoyaltyTransactions { get; set; }
    public DbSet<LoyaltyProgram> LoyaltyPrograms { get; set; }
    public DbSet<LoyaltyReward> LoyaltyRewards { get; set; }
    public DbSet<LoyaltyTier> LoyaltyTiers { get; set; }
    public DbSet<LoyaltyTierBenefit> LoyaltyTierBenefits { get; set; }
    public DbSet<LoyaltyRule> LoyaltyRules { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        SimpleEntityRegistration.RegisterEntitiesWithSchemas(modelBuilder, typeof(LoyaltyContext),
            (typeof(LoyaltyProgram), "Loyalty"),
            (typeof(LoyaltyReward), "Loyalty")
        );
    }
}
