namespace Configuration.API.Controllers;

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
        if (response == null) return NoContent();

        return Ok(response);
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
        if (response == null) return BadRequest($"No response: {establecimientoId}");

        return Ok(response);
    }

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, IFormFile file)
    {
        if (file == null) return BadRequest("File not found");

        var fileModel = await FileModelBuilder.CreateCompressedAsync(file, CompressionUtils.CompressGZip);
        var estabLogo = ObjectMapper.Map<FileModel, EstablecimientoLogo>(fileModel);
        estabLogo.UpdatedByUserId = User.GetUserId();
        var response = await _establecimientoLogoService.UpdateAsync(id, estabLogo);
        if (response == null) return BadRequest($"No response {id}");

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _establecimientoLogoService.DeleteAsync(id);
        if (response == null) return BadRequest($"No response {id}");

        return Ok(response);
    }
}
