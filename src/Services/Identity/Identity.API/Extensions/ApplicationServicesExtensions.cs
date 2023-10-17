using Identity.API.Data.Identity;
using Identity.API.Entities;
using Identity.API.Errors;
using Identity.API.Interfaces;
using Identity.API.Services;
using Identity.Services;
using Lib.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContextPool<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

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
            services.AddScoped<IAccountService, AccountService>();
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
