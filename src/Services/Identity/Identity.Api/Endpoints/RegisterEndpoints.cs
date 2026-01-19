using Identity.Api.Endpoints.ActionEndpoints;
using Identity.Api.Endpoints.LicenseAccessDetailEndpoints;
using Identity.Api.Endpoints.LicenseAccessEndpoints;
using Identity.Api.Endpoints.PolicyTypeEndpoints;
using Identity.Api.Endpoints.RoleEndpoints;
using Identity.Api.Endpoints.UserEndpoints;
using Identity.Api.Endpoints.UserRoleEndpoints;
using Identity.Api.Endpoints.UserRequestEndpoints;
using Identity.Api.Endpoints.UserPermissionEndpoints;

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
        app.MapUserEndpoints();
        app.MapUserRoleEndpoints();
        app.MapUserRequestEndpoints();
        app.MapUserPermissionEndpoints();
    }
}
