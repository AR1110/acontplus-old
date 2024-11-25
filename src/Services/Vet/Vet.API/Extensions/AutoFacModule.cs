using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Data.Configurations;
using Common.Infrastructure.Repository.Implementations;

namespace Vet.API.Extensions;

public class AutoFacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<VetContext>().As<BaseContext>();
        builder.Register(ctx =>
        {
            var allContext = new Dictionary<string, BaseContext>
            {
                { "VetContext", ctx.Resolve<VetContext>() }
            };
            return new DbContextFactory(allContext);
        });
        builder.RegisterType<AdoRepository>().As<IAdoRepository>();
    }
}
