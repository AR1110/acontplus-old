using System.Linq.Expressions;

namespace Configuration.Application.Dtos;

public static class MenuActionIncludes
{
    public static readonly Expression<Func<MenuAction, object>>[] MenuAndAction =
        new Expression<Func<MenuAction, object>>[]
        {
            x => x.Menu,
            x => x.Action
        };

    public static readonly Expression<Func<MenuAction, object>>[] Menu = new Expression<Func<MenuAction, object>>[]
    {
        x => x.Menu
    };

    public static readonly Expression<Func<MenuAction, object>>[] Action = new Expression<Func<MenuAction, object>>[]
    {
        x => x.Action
    };
}
