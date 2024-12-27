using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Data.Configurations;
using Common.Infrastructure.Repository.Implementations;
using Common.Infrastructure.Repository.Interfaces;
using Restaurant.API.Data;

namespace Restaurant.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RestaurantContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "RestaurantContext", ctx.Resolve<RestaurantContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<AdoRepository>().As<IAdoRepository>();

        }
    }
}
