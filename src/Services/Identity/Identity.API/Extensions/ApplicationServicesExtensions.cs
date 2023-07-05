using Identity.API.Errors;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Identity.Services;
using Identity.API.Data.Identity;
using Microsoft.EntityFrameworkCore;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddDbContext<ApplicationDbContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddIdentityCore<AppUser>(opt =>
            {
                // add identity options here
            })
           .AddRoles<AppRole>()
           .AddRoleManager<RoleManager<AppRole>>()
           .AddSignInManager<SignInManager<AppUser>>()
           .AddRoleValidator<RoleValidator<AppRole>>()
           .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddScoped<ITokenService, TokenService>();
            //services.AddScoped<IUnitOfWork, UnitOfWork>();
            //services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<ApiBehaviorOptions>(options =>
              options.InvalidModelStateResponseFactory = ActionContext =>
              {
                  var error = ActionContext.ModelState
                              .Where(e => e.Value.Errors.Count > 0)
                              .SelectMany(e => e.Value.Errors)
                              .Select(e => e.ErrorMessage).ToArray();
                  var errorresponce = new ApiValidationErrorResponse
                  {
                      Errors = error
                  };
                  return new BadRequestObjectResult(error);
              }
            );
            return services;
        }
    }
}
