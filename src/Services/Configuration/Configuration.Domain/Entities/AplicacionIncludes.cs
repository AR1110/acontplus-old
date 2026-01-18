namespace Configuration.Domain.Entities;

public static class AplicacionIncludes
{
    public static readonly string[] System = { nameof(Applications.System) };
    public static readonly string[] Menus = { nameof(Applications.Menus) };
    public static readonly string[] SystemAndMenus = { nameof(Applications.System), nameof(Applications.Menus) };
}
