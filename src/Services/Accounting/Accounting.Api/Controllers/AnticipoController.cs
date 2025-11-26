namespace Accounting.Api.Controllers;

public class AnticipoController(IAnticipoRepository anticipoRepository) : BaseApiController
{
    private const string UserRoleIdClaim = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        return Ok(await anticipoRepository.GetAsync(new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateAnticipoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", DataConverters.SerializeObjectCustom<CreateAnticipoDto>(request) }
        };

        var response = await anticipoRepository.AddAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdateAnticipoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<UpdateAnticipoDto>(request) }
        };

        var response = await anticipoRepository.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleIdClaim, User.GetClaimValue<int>(UserRoleIdClaim) },
            { "id", id }
        };
        var response = await anticipoRepository.DeleteAsync(parameters);
        return Ok(response);
    }
}
