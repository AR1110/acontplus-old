using System.Security.Claims;

namespace Services.Common.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value;
    }

    public static int GetCompanyId(this ClaimsPrincipal user)
    {
        return Convert.ToInt32(user.FindFirst("companyId")?.Value);
    }

    public static string GetIdCardCompany(this ClaimsPrincipal user)
    {
        return user.FindFirst("idCardCompany")?.Value;
    }

    public static int GetUserRoleId(this ClaimsPrincipal user)
    {
        return Convert.ToInt32(user.FindFirst("userRoleId")?.Value);
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
}
