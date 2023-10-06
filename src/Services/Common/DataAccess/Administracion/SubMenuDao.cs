using System.Data;
using System.Data.SqlClient;
using Domain.Models.Administracion;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class SubMenuDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public SubMenuDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, int idMenu)
        {
            var listar = new List<SubMenu>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspSubMenuGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idMenu", idMenu);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var sm = new SubMenu()
                            {
                                idSubMenu = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                url = reader.GetString(5),
                                icono = reader.GetString(6),
                                estado = reader.GetBoolean(7),
                                codTemp = reader.GetString(8),
                            };
                            listar.Add(sm);
                        }
                    }
                    _gr.data = listar;
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar SubMenu";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, SubMenu data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspSubMenuInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idMenu", data.idMenu);
                    cmd.Parameters.AddWithValue("url", data.url);
                    cmd.Parameters.AddWithValue("icono", data.icono);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codTemp", data.codTemp);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Agregar SubMenu";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idSubMenu, SubMenu data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspSubMenuUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idSubMenu", idSubMenu);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("url", data.url);
                    cmd.Parameters.AddWithValue("icono", data.icono);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar SubMenu";
            }
            finally
            {

            }
            return _gr;

        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idSubMenu)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspSubMenuDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idSubMenu", idSubMenu);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar SubMenu";
            }
            return _gr;
        }
    }
}