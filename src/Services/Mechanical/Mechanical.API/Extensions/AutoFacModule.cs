using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;
using Mechanical.Infrastructure.Data;

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
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
