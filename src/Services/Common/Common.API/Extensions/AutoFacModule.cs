using Common.API.Data;

namespace Common.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<CommonContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext> { { "CommonContext", ctx.Resolve<CommonContext>() } };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
