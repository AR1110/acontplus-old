using Autofac;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;

namespace TechnicalSupport.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            //builder.RegisterType<>().As<BaseContext>();
            //builder.Register(ctx =>
            //{
            //    var allContext = new Dictionary<string, BaseContext>
            //    {
            //        { "", ctx.Resolve<>() }
            //    };
            //    return new DbContextFactory(allContext);

            //});
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
