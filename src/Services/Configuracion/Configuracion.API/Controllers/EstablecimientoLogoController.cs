namespace Configuracion.API.Controllers;

public class EstablecimientoLogoController : BaseApiController
{
    private readonly IEstablecimientoLogoService _establecimientoLogoService;
    private readonly IMapper _mapper;

    public EstablecimientoLogoController(IEstablecimientoLogoService establecimientoLogoService,
        IMapper mapper)
    {
        _establecimientoLogoService = establecimientoLogoService;
        _mapper = mapper;
    }

    [HttpGet("{establecimientoId}")]
    public async Task<IActionResult> Get(int establecimientoId)
    {
        var response = await _establecimientoLogoService.GetAsync(establecimientoId);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPost("{establecimientoId}")]
    public async Task<IActionResult> Post(int establecimientoId, IFormFile file)
    {
        var logo = new FileModel();
        await logo.CreateBytesCompressedDeflatedAsync(file);
        var estabLogo = _mapper.Map<EstablecimientoLogo>(logo);
        estabLogo.EstablecimientoId = establecimientoId;
        estabLogo.UserId = User.GetUserId();
        var response = await _establecimientoLogoService.AddAsync(estabLogo);
        if (response == null) { return BadRequest($"No response: {establecimientoId}"); }

        return Ok(response);
    }

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, IFormFile file)
    {
        if (file == null) { return BadRequest("File not found"); }

        var logo = new FileModel();
        await logo.CreateBytesCompressedDeflatedAsync(file);
        var estabLogo = _mapper.Map<EstablecimientoLogo>(logo);
        estabLogo.UserId = User.GetUserId();
        var response = await _establecimientoLogoService.UpdateAsync(id, estabLogo);
        if (response == null) { return BadRequest($"No response {id}"); }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _establecimientoLogoService.DeleteAsync(id);
        if (response == null) { return BadRequest($"No response {id}"); }

        return Ok(response);
    }
}
