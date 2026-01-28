using System.Linq.Expressions;

namespace Configuration.Application.Dtos;

public static class MenuActionIncludes
{
    // Action navigation removed - Actions entity is in Identity service
    // Use Menu-only includes now
    public static readonly Expression<Func<MenuAction, object>>[] MenuAndAction =
        new Expression<Func<MenuAction, object>>[]
        {
            x => x.Menu
        };

    public static readonly Expression<Func<MenuAction, object>>[] Menu = new Expression<Func<MenuAction, object>>[]
    {
        x => x.Menu
    };
}
