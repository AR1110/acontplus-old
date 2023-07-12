using Identity.API.Errors;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Identity.Services;
using Identity.API.Data.Identity;
using Microsoft.EntityFrameworkCore;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Lib.Common;

namespace Identity.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(Encryption.DecryptString(configuration.GetSection("KeyEncryption").Value, configuration.GetConnectionString("DefaultConnection"))));
            
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
