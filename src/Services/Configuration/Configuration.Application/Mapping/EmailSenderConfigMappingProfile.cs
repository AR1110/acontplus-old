namespace Configuration.Application.Mapping;

public static class EmailSenderConfigMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<EmailSenderConfig, EmailSenderConfigItem>();
    }
}
