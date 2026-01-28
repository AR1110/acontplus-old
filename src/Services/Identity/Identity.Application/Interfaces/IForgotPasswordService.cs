namespace Identity.Application.Interfaces;

public interface IForgotPasswordService
{
    Task<string> GetAsync(string email);
    Task<string> AddAsync(ForgotPassword data);
}