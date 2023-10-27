using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Reports.API.Data
{
    public class ReportsContext : BaseContext
    {
        public ReportsContext(DbContextOptions<ReportsContext> options) : base(options)
        {

        }
    }
}
