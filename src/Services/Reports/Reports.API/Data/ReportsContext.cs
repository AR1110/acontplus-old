using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Reports.API.Data
{
    public class ReportsContext(DbContextOptions<ReportsContext> options) : BaseContext(options);
}
