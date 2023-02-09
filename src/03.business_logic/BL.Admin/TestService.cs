using DataAccess;
using Helpers;
using Microsoft.Extensions.Configuration;

namespace BL.Admin.Data
{
    public class TestService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public TestService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            try
            {
                DbAccess adb  = new DbAccess(_config);
                await adb.SPExecute("Config.Suscripcion_Get");
                adb.AddDynamicParam("@json", json);
                //adb.ReadAsync(getData, ref respDb);
                //_response.code = respDb[0].ToString();
                //_response.message = respDb[1].ToString();
                //if (_response.code == "0" && getData)
                //{
                //    _response.payload = respDb[2].ToString();
                //}
            }
            catch (Exception ex)
            {
                _response.Create("-1", "Error en el servidor", ex.Message);
            }
            finally
            {

            }
            return _response;
        }
    }
}