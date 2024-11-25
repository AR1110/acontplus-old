using Common.Infrastructure.Data;
using Common.Infrastructure.Data.Configurations;
using Common.Infrastructure.Repository.Implementations;

namespace Configuracion.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<ConfigContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext> { { "ConfigContext", ctx.Resolve<ConfigContext>() } };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
