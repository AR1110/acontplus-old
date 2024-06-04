using Autofac;

namespace Ventas.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<VentasContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext> { { "VentasContext", ctx.Resolve<VentasContext>() } };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
