namespace Identity.Api.Mapping;

public static class LicenciaAccesoMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping
        config.NewConfig<LicenciaAccesoCreate, LicenciaAcceso>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Licencia)
            .Ignore(dest => dest.Role)
            .Ignore(dest => dest.LicenciaAccesoDetalles);

        // Update mapping
        config.NewConfig<LicenciaAccesoUpdate, LicenciaAcceso>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Licencia)
            .Ignore(dest => dest.Role)
            .Ignore(dest => dest.LicenciaAccesoDetalles);

        // Create LicenciaAccesoDetalle mapping
        config.NewConfig<LicenciaAccesoDetalleCreate, LicenciaAccesoDetalle>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenciaAcceso)
            .Map(dest => dest.MenuId, src => src.SubmenuId);

        // Update LicenciaAccesoDetalle mapping
        config.NewConfig<LicenciaAccesoDetalleUpdate, LicenciaAccesoDetalle>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenciaAcceso)
            .Map(dest => dest.MenuId, src => src.SubmenuId);

        // Create LicenciaAccesoDetalle mapping
        config.NewConfig<LicenciaAccesoDetalleDto, LicenciaAccesoDetalle>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenciaAcceso)
            .Ignore(dest => dest.LicenciaAccesoId);
    }
}