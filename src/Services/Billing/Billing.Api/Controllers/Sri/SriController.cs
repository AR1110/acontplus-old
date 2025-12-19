namespace Billing.Api.Controllers.Sri;

public class SriController : BaseApiController
{
    private readonly ISriAuthenticationService _sriAuth;

    public SriController(ISriAuthenticationService sriAuth)
    {
        _sriAuth = sriAuth;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<SriAuthenticationResult>> Authenticate(
        [FromBody] SriLoginRequest request)
    {
        var result = await _sriAuth.AuthenticateAsync(
            request.Username,
            request.Password,
            request.AdditionalCi);

        return result.IsSuccess ? (ActionResult<SriAuthenticationResult>)Ok(result) : (ActionResult<SriAuthenticationResult>)BadRequest(result);
    }

    [AllowAnonymous]
    [HttpPost("documents/received")]
    public async Task<ActionResult<SriDocumentsResponse>> GetReceivedDocuments(
        [FromBody] SriDocumentsRequest request)
    {
        var result = await _sriAuth.GetReceivedDocumentsAsync(request);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
