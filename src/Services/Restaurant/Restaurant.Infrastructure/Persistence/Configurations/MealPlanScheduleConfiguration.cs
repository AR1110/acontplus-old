using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Restaurant.Infrastructure.Persistence.Configurations
{
    public class MealPlanScheduleConfiguration: BaseEntityTypeConfiguration<MealPlanSchedule>
    {
        public override void Configure(EntityTypeBuilder<MealPlanSchedule> builder)
        {
            base.Configure(builder);

            builder
                .Property(x => x.IsIncluded)
                .HasDefaultValue(true)
                .IsRequired();
        }
    }
}
