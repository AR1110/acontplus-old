using Identity.API.Entities;

namespace Identity.API.Interfaces
{
    public interface IForgotPasswordService
    {
        Task<string> GetAsync(string email);
        Task<string> AddAsync(ForgotPassword data);
    }
}
