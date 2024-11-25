using Common.Infrastructure.Data;
using Common.Infrastructure.Data.Configurations;
using Common.Infrastructure.Repository.Implementations;

namespace Compras.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<ComprasContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext>
            {
                { "ComprasContext", ctx.Resolve<ComprasContext>() }
            };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
