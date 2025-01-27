using System.Security.Claims;

namespace Common.AppSettings.Extensions;

public static class CustomClaimsPrincipalExtensions
{
    public static int GetCompanyId(this ClaimsPrincipal user)
    {
        return Convert.ToInt32(user.FindFirst("companyId")?.Value);
    }

    public static string GetIdCardCompany(this ClaimsPrincipal user)
    {
        return user.FindFirst("idCardCompany")?.Value;
    }
}
