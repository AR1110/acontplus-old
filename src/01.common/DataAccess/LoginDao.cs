using Domain.Dtos;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class LoginDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public LoginDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }

        public async Task<GenericResponse> LoginAsync(LoginDto data)
        {
            var loginData = new LoginViewModel();
            var userData = new List<LoginData>();
            var menus = new List<LoginMenu>();
            var subMenus = new List<LoginSubMenu>();
            var returnUrl = data.returnUrl;
            if (returnUrl == "/")
            {
                returnUrl = null;
            }
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("Seguridad.Login_Start", con))
                    {
                        cmd.Parameters.AddWithValue("id", data.id);
                        cmd.Parameters.AddWithValue("nombreUsuario", data.userName);
                        cmd.Parameters.AddWithValue("contrasenia", data.password);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.Create(code: reader.GetString(0), message: reader.GetString(1), titleSms: reader.GetString(2));

                                if (_gr.id == "1" || _gr.id == "2") //multi rol
                                {
                                    var item = new LoginData();
                                    item.idRol = reader.GetInt32(3);
                                    item.userName = reader.GetString(4);
                                    item.fullName = reader.GetString(5);
                                    item.nroIdentificacion = reader.GetString(6);
                                    item.image = reader.GetString(7);
                                    item.entidad = reader.GetString(8);
                                    item.nombreComercial = reader.GetString(9);
                                    item.role = reader.GetString(10);
                                    item.actividad = reader.GetString(11);
                                    item.ruc = reader.GetString(12);
                                    userData.Add(item);
                                }
                            }
                            if (_gr.id == "2")
                            {
                                reader.NextResult();
                                while (reader.Read())
                                {
                                    var item = new LoginMenu
                                    {
                                        idMenu = reader.GetInt32(0),
                                        subMenu = reader.GetBoolean(1),
                                        url = reader.GetString(2),
                                        icon = reader.GetString(3),
                                        description = reader.GetString(4)
                                    };
                                    menus.Add(item);
                                }
                                reader.NextResult();
                                while (reader.Read())
                                {
                                    var item = new LoginSubMenu
                                    {
                                        idMenu = reader.GetInt32(0),
                                        idSubMenu = reader.GetInt32(1),
                                        url = reader.GetString(2),
                                        icon = reader.GetString(3),
                                        description = reader.GetString(4)
                                    };
                                    subMenus.Add(item);
                                }
                            }
                        }

                        loginData.userData = userData;
                        loginData.menus = menus;
                        loginData.subMenus = subMenus;
                        loginData.returnUrl = returnUrl ?? "/Home/Index";
                        _gr.data = loginData;
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Login";
            }
            return _gr;
        }




    }
}