using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;

namespace BL.Admin.Data
{
    public class LoginService
    {
        private readonly GenericResponse _response = new();
        private readonly IConfiguration _config;
        public LoginService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> LoginAsync(Login data)
        {
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Login");
                adb.AddDynamicParam("@username", data.Username);
                adb.AddDynamicParam("@password", data.Username);
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