using AutoMapper;
using TechnicalSupport.API.Dtos;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Extensions
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<OrderDto, Order>();
        }
    }
}
