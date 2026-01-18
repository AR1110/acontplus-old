using Identity.Api.Endpoints.ActionEndpoints;
using Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;
using Identity.Api.Endpoints.LicenciaAccesoEndpoints;
using Identity.Api.Endpoints.PolicyTypeEndpoints;
using Identity.Api.Endpoints.RoleEndpoints;
using Identity.Api.Endpoints.ScheduleCompanyEndpoints;

namespace Identity.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllIdentityEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAccountEndpoints();
        app.MapLookupEndpoints();
        app.MapUserProfileEndpoints();
        app.MapLicenciaAccesoEndpoints();
        app.MapLicenciaAccesoDetalleEndpoints();
        app.MapPolicyTypeEndpoints();
        app.MapRoleEndpoints();
        app.MapScheduleCompanyEndpoints();
        app.MapActionEndpoints();
    }
}
