using ApiConfig.Data;
using Autofac;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;

namespace ApiConfig.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ConfigContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "ConfigContext", ctx.Resolve<ConfigContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
