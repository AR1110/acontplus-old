namespace Billing.Application.Dtos;

public sealed class RecaptchaSolveResult
{
    public bool IsSuccess { get; init; }
    public string? Token { get; init; }
    public string? Error { get; init; }

    public static RecaptchaSolveResult Success(string token) => new() { IsSuccess = true, Token = token };
    public static RecaptchaSolveResult Failure(string error) => new() { IsSuccess = false, Error = error };
}
