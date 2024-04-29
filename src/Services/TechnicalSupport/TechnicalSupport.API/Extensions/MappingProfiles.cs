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
