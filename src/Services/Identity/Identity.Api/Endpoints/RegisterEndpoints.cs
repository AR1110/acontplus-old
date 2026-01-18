using Identity.Api.Endpoints.ActionEndpoints;
using Identity.Api.Endpoints.LicenseAccessDetailEndpoints;
using Identity.Api.Endpoints.LicenseAccessEndpoints;
using Identity.Api.Endpoints.PolicyTypeEndpoints;
using Identity.Api.Endpoints.RoleEndpoints;

namespace Identity.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllIdentityEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAccountEndpoints();
        app.MapLookupEndpoints();
        app.MapUserProfileEndpoints();
        app.MapLicenseAccessEndpoints();
        app.MapLicenseAccessDetailEndpoints();
        app.MapRoleEndpoints();
        app.MapPolicyTypeEndpoints();
        app.MapActionEndpoints();
    }
}
