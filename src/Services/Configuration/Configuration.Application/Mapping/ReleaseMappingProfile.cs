namespace Configuration.Application.Mapping;

public static class ReleaseMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Release, ReleaseItem>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.AplicacionId, src => src.AplicacionId)
            .Map(dest => dest.AplicacionName, src => src.Aplicacion != null ? src.Aplicacion.Name : string.Empty)
            .Map(dest => dest.ReleaseDate, src => src.ReleaseDate)
            .Map(dest => dest.Version, src => src.Version)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.LogoutRequired, src => src.LogoutRequired)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);

        config.NewConfig<Release, ReleaseCreatedResponse>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.AplicacionId, src => src.AplicacionId)
            .Map(dest => dest.AplicacionName, src => src.Aplicacion != null ? src.Aplicacion.Name : string.Empty)
            .Map(dest => dest.ReleaseDate, src => src.ReleaseDate)
            .Map(dest => dest.Version, src => src.Version)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.LogoutRequired, src => src.LogoutRequired)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.CreatedByUserId, src => src.CreatedByUserId ?? 0);

        config.NewConfig<Release, ReleaseUpdatedResponse>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.AplicacionId, src => src.AplicacionId)
            .Map(dest => dest.AplicacionName, src => src.Aplicacion != null ? src.Aplicacion.Name : string.Empty)
            .Map(dest => dest.ReleaseDate, src => src.ReleaseDate)
            .Map(dest => dest.Version, src => src.Version)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.Content, src => src.Content)
            .Map(dest => dest.LogoutRequired, src => src.LogoutRequired)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt ?? DateTime.UtcNow)
            .Map(dest => dest.CreatedByUserId, src => src.CreatedByUserId ?? 0)
            .Map(dest => dest.UpdatedByUserId, src => src.UpdatedByUserId ?? src.CreatedByUserId ?? 0);
    }
}
