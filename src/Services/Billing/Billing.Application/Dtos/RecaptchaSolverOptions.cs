namespace Billing.Application.Dtos;

public class RecaptchaSolverOptions
{
  public bool Enabled { get; set; } = false;
  public string Provider { get; set; } = "2captcha";
  public string ApiKey { get; set; } = string.Empty;
  public string BaseUrl { get; set; } = "https://2captcha.com/";
  public int PollIntervalSeconds { get; set; } = 5;
  public int TimeoutSeconds { get; set; } = 120;
}
