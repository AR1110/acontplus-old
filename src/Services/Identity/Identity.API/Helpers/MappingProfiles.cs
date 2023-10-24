using AutoMapper;
using Identity.API.Dtos;
using Identity.Core.Entities;

namespace Identity.API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //CreateMap<Address, AddressDto>();
            //.ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
            //.ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
            //.ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
        }
    }
}
