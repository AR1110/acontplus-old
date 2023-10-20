using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;
using Identity.Infrastructure.Data;

namespace Identity.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationDbContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    {"ApplicationDbContext", ctx.Resolve<ApplicationDbContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
