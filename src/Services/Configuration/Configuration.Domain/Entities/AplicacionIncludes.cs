namespace Configuration.Domain.Entities;

public static class AplicacionIncludes
{
    public static readonly string[] Sistema = { nameof(Aplicacion.Sistema) };
    public static readonly string[] Menus = { nameof(Aplicacion.Menus) };
    public static readonly string[] SistemaAndMenus = { nameof(Aplicacion.Sistema), nameof(Aplicacion.Menus) };
}