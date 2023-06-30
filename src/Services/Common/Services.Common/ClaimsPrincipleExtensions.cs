using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Services.Common
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }
        public static string GetCompanyId(this ClaimsPrincipal user)
        {
            return user.FindFirst("companyUniqueId")?.Value;
        }
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}