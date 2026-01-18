using System.Linq.Expressions;

namespace Configuration.Application.Dtos;

public static class MenuIncludes
{
    public static Expression<Func<Menu, object>> Application => m => m.Application;
}
