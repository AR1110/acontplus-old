using System.Web;

namespace FactElect.API.Controllers.DocElect.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class DocumentoElectronicoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    

    public DocumentoElectronicoController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        try
        {
            
            await _db.SPExecute("FactElect.Doc_Elect_Get", true);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("GetByStatus")]
    public async Task<IActionResult> GetByStatus(string json)
    {
        var _response = new ApiResponse();
        try
        {
            
            await _db.SPExecute("FactElect.Doc_Elect_GetByStatus", true);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm()
    {
        var _response = new ApiResponse();
        try
        {
            

            await _db.SPExecute("FactElect.Doc_Elect_Get_Data_Form");
            _db.AddDynamicParam("idUsuarioRol ", User.GetUserRoleId());
            _response = _db.GetDataSetAsync();
        }
        finally { _db.Close(); }

        return Ok(_response);
    }

    [HttpGet("GetXmlSri/{id}")]
    public async Task<IActionResult> GetXmlSri(int id)
    {
        var _response = new FileModel();
        try
        {
            

            await _db.SPExecute("FactElect.Doc_Elect_Get_Xml");
            _db.AddDynamicParam("idUsuarioRol ", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            var dt = _db.GetDataTable();
            if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlSri"))
            {
                var xmlSri = string.Empty;
                xmlSri = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlSri"));
                var byteXml = Encoding.UTF8.GetBytes(xmlSri);
                _response.CreateBase64(byteXml, "text/xml", dt.Rows[0].Field<string>("filename") + ".xml");
                //var sms = "";
                //await new FileUpload().Upload(_configuration.GetSection("WhatsAppFiles").Value, _response.FileName, _response.Content);
                return File(_response.Content, _response.ContentType, _response.FileName);
            }

            return BadRequest("No se encontro xml");
        }
        finally
        {
            _db.Close();
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var _response = new ApiResponse();
        try
        {
            
            await _db.SPExecute("FactElect.Doc_Elect_Update");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
