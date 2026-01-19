namespace Sales.Application.Mapping;

public static class SalesMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // SuscripcionCreate -> Suscripcion
        config.NewConfig<SuscripcionCreate, Suscripcion>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.IsDeleted)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Ignore(dest => dest.SuscripcionDetalles);

        // SuscripcionDetalleCreate -> SuscripcionDetalle
        config.NewConfig<SuscripcionDetalleCreate, SuscripcionDetalle>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.Suscripcion)
            .Ignore(dest => dest.SuscripcionId);

        // SuscripcionDetalleUpdate -> SuscripcionDetalle
        config.NewConfig<SuscripcionDetalleUpdate, SuscripcionDetalle>()
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.Suscripcion);

        // Suscripcion -> SubscriptionResponse
        config.NewConfig<Suscripcion, SubscriptionResponse>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.SubscriptionTypeId, src => src.SubscriptionTypeId)
            .Map(dest => dest.CompanyId, src => src.CompanyId)
            .Map(dest => dest.StartDate, src => src.StartDate.ToString("yyyy-MM-dd"))
            .Map(dest => dest.EndDate, src => src.EndDate.ToString("yyyy-MM-dd"))
            .Map(dest => dest.MaxPaymentDate, src => src.MaxPaymentDate.ToString("yyyy-MM-dd"))
            .Map(dest => dest.Cost, src => src.Cost)
            .Map(dest => dest.Tax, src => src.Tax)
            .Map(dest => dest.Discount, src => src.Discount)
            .Map(dest => dest.Total, src => src.Total)
            .Map(dest => dest.Paid, src => src.Paid)
            .Map(dest => dest.WarningMessage, src => src.WarningMessage)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.IsDeleted, src => src.IsDeleted)
            .Map(dest => dest.CreatedByUserId, src => src.CreatedByUserId)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") : null);

        // SuscripcionDetalle -> SuscripcionDetalleDto
        config.NewConfig<SuscripcionDetalle, SuscripcionDetalleDto>();
    }
}
