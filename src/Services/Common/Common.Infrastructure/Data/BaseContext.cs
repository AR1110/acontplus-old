using Microsoft.EntityFrameworkCore;

namespace Common.Infrastructure.Data
{
    public class BaseContext : DbContext
    {
        public BaseContext(DbContextOptions options) : base(options) { }
    }
}
