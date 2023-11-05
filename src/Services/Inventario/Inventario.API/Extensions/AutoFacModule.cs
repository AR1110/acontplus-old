using Autofac;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;
using Inventario.Infrastructure.Data;

namespace Inventario.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<InventarioContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "InventarioContext", ctx.Resolve<InventarioContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
