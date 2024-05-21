namespace Configuracion.API.Extensions;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<FileModel, EstablecimientoLogo>();
    }
}
