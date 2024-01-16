using Autofac;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;
using Customer.API.Data;

namespace Customer.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<CustomerContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "CustomerContext", ctx.Resolve<CustomerContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }

}
