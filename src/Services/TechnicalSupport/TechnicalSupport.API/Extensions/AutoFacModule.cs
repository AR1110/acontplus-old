using Common.Infrastructure.Data;
using Common.Infrastructure.Repository.Implementations;

namespace TechnicalSupport.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<TechnicalSupportContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext>
            {
                { "TechnicalSupportContext", ctx.Resolve<TechnicalSupportContext>() }
            };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
