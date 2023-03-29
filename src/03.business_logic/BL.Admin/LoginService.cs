using DataAccess;
using Domain.Admin.Models;
using Domain.Auth.Dtos;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class LoginService
    {
        private readonly IConfiguration _config;
        public LoginService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> LoginAsync(Login data)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Sec_App.Login");
                adb.AddDynamicParam("@username", data.Username);
                adb.AddDynamicParam("@password", data.Password);
                DataTable dt = adb.GetDataTable();
                if (dt.Rows[0]["code"].ToString() == "-1")
                {
                    _response.Create(code: "-1", message: "Error al logearse");
                }
                else
                {
                    _response.Create(code: "0", message: "Login exitoso", payload: DataHelper.BindData<LoginDataDto>(dt));
                }
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