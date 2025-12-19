using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Billing.Application.Services.Sri;

public class TwoCaptchaSolver : IRecaptchaSolver
{
  private readonly HttpClient _httpClient;
  private readonly ILogger<TwoCaptchaSolver> _logger;
  private readonly RecaptchaSolverOptions _options;

  private sealed class TwoCaptchaResponse
  {
    public int Status { get; set; }
    public string? Request { get; set; }
  }

  public TwoCaptchaSolver(HttpClient httpClient, ILogger<TwoCaptchaSolver> logger, IOptions<RecaptchaSolverOptions> options)
  {
    _httpClient = httpClient;
    _logger = logger;
    _options = options.Value;

    if (_httpClient.BaseAddress == null)
    {
      _httpClient.BaseAddress = new Uri(_options.BaseUrl);
    }
  }

  public async Task<RecaptchaSolveResult> SolveAsync(string siteKey, string pageUrl, int timeoutSeconds, CancellationToken cancellationToken = default)
  {
    if (!_options.Enabled || string.IsNullOrWhiteSpace(_options.ApiKey))
    {
      return RecaptchaSolveResult.Failure("reCAPTCHA solver disabled or API key missing");
    }

    var submitPayload = new Dictionary<string, string>
    {
      ["key"] = _options.ApiKey,
      ["method"] = "userrecaptcha",
      ["googlekey"] = siteKey,
      ["pageurl"] = pageUrl,
      ["json"] = "1"
    };

    try
    {
      _logger.LogInformation("Submitting reCAPTCHA for solving via {Provider}", _options.Provider);
      using var submitContent = new FormUrlEncodedContent(submitPayload);
      using var submitResponse = await _httpClient.PostAsync("in.php", submitContent, cancellationToken);
      submitResponse.EnsureSuccessStatusCode();
      var submitJson = await submitResponse.Content.ReadAsStringAsync(cancellationToken);
      var submit = JsonSerializer.Deserialize<TwoCaptchaResponse>(submitJson);

      if (submit == null || submit.Status != 1 || string.IsNullOrWhiteSpace(submit.Request))
      {
        _logger.LogWarning("reCAPTCHA submit failed: {Response}", submitJson);
        return RecaptchaSolveResult.Failure("Solver submit failed");
      }

      var requestId = submit.Request;
      var pollInterval = TimeSpan.FromSeconds(Math.Max(1, _options.PollIntervalSeconds));
      var effectiveTimeout = TimeSpan.FromSeconds(Math.Max(10, Math.Min(timeoutSeconds <= 0 ? _options.TimeoutSeconds : timeoutSeconds, _options.TimeoutSeconds)));
      var deadline = DateTime.UtcNow + effectiveTimeout;

      while (DateTime.UtcNow < deadline)
      {
        cancellationToken.ThrowIfCancellationRequested();
        await Task.Delay(pollInterval, cancellationToken);

        var pollUri = $"res.php?key={_options.ApiKey}&action=get&id={requestId}&json=1";
        using var pollResponse = await _httpClient.GetAsync(pollUri, cancellationToken);
        pollResponse.EnsureSuccessStatusCode();
        var pollJson = await pollResponse.Content.ReadAsStringAsync(cancellationToken);
        var poll = JsonSerializer.Deserialize<TwoCaptchaResponse>(pollJson);

        if (poll == null)
        {
          _logger.LogWarning("Solver poll returned null payload");
          continue;
        }

        if (poll.Status == 1 && !string.IsNullOrWhiteSpace(poll.Request))
        {
          _logger.LogInformation("reCAPTCHA solved via {Provider}", _options.Provider);
          return RecaptchaSolveResult.Success(poll.Request);
        }

        if (string.Equals(poll.Request, "CAPCHA_NOT_READY", StringComparison.OrdinalIgnoreCase))
        {
          continue;
        }

        _logger.LogWarning("Solver returned error: {Error}", poll.Request);
        return RecaptchaSolveResult.Failure(poll.Request ?? "Solver returned error");
      }

      return RecaptchaSolveResult.Failure("Solver timeout waiting for token");
    }
    catch (OperationCanceledException)
    {
      throw;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "reCAPTCHA solver error");
      return RecaptchaSolveResult.Failure(ex.Message);
    }
  }
}
