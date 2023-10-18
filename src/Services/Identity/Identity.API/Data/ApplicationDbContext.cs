using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Data.Identity
{
    public class ApplicationDbContext : BaseContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
