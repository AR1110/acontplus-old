namespace Configuration.Api.Controllers;

public class EstablecimientoLogoController : BaseApiController
{
    private readonly IEstablecimientoLogoRepository _establecimientoLogoService;


    public EstablecimientoLogoController(IEstablecimientoLogoRepository establecimientoLogoService)
    {
        _establecimientoLogoService = establecimientoLogoService;
    }

    [HttpGet("{establecimientoId}")]
    public async Task<IActionResult> Get(int establecimientoId)
    {
        var response = await _establecimientoLogoService.GetAsync(establecimientoId);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost("{establecimientoId}")]
    public async Task<IActionResult> Post(int establecimientoId, IFormFile file)
    {
        var fileModel = await FileModelBuilder.CreateCompressedAsync(file, CompressionUtils.CompressGZip);
        var estabLogo = ObjectMapper.Map<FileModel, EstablecimientoLogo>(fileModel);
        estabLogo.EstablecimientoId = establecimientoId;
        estabLogo.CreatedByUserId = User.GetUserId();
        estabLogo.CreatedByUserId = User.GetUserId();
        var response = await _establecimientoLogoService.AddAsync(estabLogo);
        return response == null ? BadRequest($"No response: {establecimientoId}") : Ok(response);
    }

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, IFormFile file)
    {
        if (file == null) return BadRequest("File not found");

        var fileModel = await FileModelBuilder.CreateCompressedAsync(file, CompressionUtils.CompressGZip);
        var estabLogo = ObjectMapper.Map<FileModel, EstablecimientoLogo>(fileModel);
        estabLogo.UpdatedByUserId = User.GetUserId();
        var response = await _establecimientoLogoService.UpdateAsync(id, estabLogo);
        return response == null ? BadRequest($"No response {id}") : Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _establecimientoLogoService.DeleteAsync(id);
        return response == null ? BadRequest($"No response {id}") : Ok(response);
    }
}
