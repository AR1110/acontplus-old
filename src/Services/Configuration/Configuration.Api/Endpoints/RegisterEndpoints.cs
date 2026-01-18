using Configuration.Api.Endpoints.ApplicationEndpoints;
using Configuration.Api.Endpoints.CompanyEndpoints;
using Configuration.Api.Endpoints.DemoStepEndpoints;
using Configuration.Api.Endpoints.Ec2InstanceEndpoints;
using Configuration.Api.Endpoints.EmailSenderConfigEndpoints;
using Configuration.Api.Endpoints.LicenseDetailEndpoints;
using Configuration.Api.Endpoints.LicenseEndpoints;
using Configuration.Api.Endpoints.LicenseTypeEndpoints;
using Configuration.Api.Endpoints.MenuActionEndpoints;
using Configuration.Api.Endpoints.MenuEndpoints;
using Configuration.Api.Endpoints.PrintEndpoints;
using Configuration.Api.Endpoints.PrinterDocumentEndpoints;
using Configuration.Api.Endpoints.PrinterEndpoints;
using Configuration.Api.Endpoints.PrinterTypeEndpoints;
using Configuration.Api.Endpoints.ReportEndpoints;
using Configuration.Api.Endpoints.ScheduleCompanyEndpoints;
using Configuration.Api.Endpoints.SubscriptionTypeEndpoints;
using Configuration.Api.Endpoints.SystemEndpoints;
using Configuration.Api.Endpoints.UserCustomerEndpoints;
using Configuration.Api.Endpoints.UserCustomerRoleEndpoints;
using Configuration.Api.Endpoints.WhatsappUsageEndpoints;

namespace Configuration.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapLookupEndpoints();
        app.MapPrinterEndpoints();
        app.MapPrinterDocumentEndpoints();
        app.MapPrinterTypeEndpoints();
        app.MapPrintEndpoints();
        app.MapLicenseDetailEndpoints();
        app.MapUserCustomerEndpoints();
        app.MapUserCustomerRoleEndpoints();
        app.MapApplicationEndpoints();
        app.MapCompanyEndpoints();
        app.MapMenuActionEndpoints();
        app.MapMenuEndpoints();
        app.MapReportEndpoints();
        app.MapSystemEndpoints();
        app.MapDemoStepEndpoints();
        app.MapEc2InstanceEndpoints();
        app.MapLicenseTypeEndpoints();
        app.MapLicenseEndpoints();
        app.MapSubscriptionTypeEndpoints();
        app.MapEmailSenderConfigEndpoints();
        app.MapWhatsappUsageEndpoints();
        app.MapScheduleCompanyEndpoints();
    }
}
