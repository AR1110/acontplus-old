using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Data.Configurations;
using Common.Infrastructure.Repository.Implementations;
using Common.Infrastructure.Repository.Interfaces;
using Mechanical.API.Data;

namespace Mechanical.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<MechanicalContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "MechanicalContext", ctx.Resolve<MechanicalContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<AdoRepository>().As<IAdoRepository>();

        }
    }
}
