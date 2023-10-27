using Autofac;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Common.Infrastructure.Repository;
using Reports.API.Data; 

namespace Reports.API.Extensions
{
    public class AutoFacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ReportsContext>().As<BaseContext>();
            builder.Register(ctx =>
            {
                var allContext = new Dictionary<string, BaseContext>
                {
                    { "ReportsContext", ctx.Resolve<ReportsContext>() }
                };
                return new DbContextFactory(allContext);

            });
            builder.RegisterType<ADORepository>().As<IADORepository>();

        }
    }
}
