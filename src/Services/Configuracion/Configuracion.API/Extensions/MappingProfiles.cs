using AutoMapper;
using Common.Core.Models;
using Configuracion.API.Entities;

namespace Configuracion.API.Extensions
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<FileModel, EstablecimientoLogo>();
        }
    }
}
