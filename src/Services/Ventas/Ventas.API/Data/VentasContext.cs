using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ventas.API.Data
{
    public class VentasContext : BaseContext
    {
        public VentasContext(DbContextOptions<VentasContext> options) : base(options)
        {

        }
    }
}
