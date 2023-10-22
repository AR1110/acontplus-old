using System.Data;
using System.Data.SqlClient;
using Domain.Dtos;
using Domain.Models.Administracion;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Administracion
{
    public class MenuDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public MenuDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var listar = new List<Menu>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspMenuGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var m = new Menu()
                            {
                                idMenu = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                url = reader.GetString(5),
                                icono = reader.GetString(6),
                                estado = reader.GetBoolean(7),
                                grupo = reader.GetString(8),
                            };
                            listar.Add(m);
                        }

                    }
                    _gr.data = listar;
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Menu Listar";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Menu data)
        {

            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {

                    var cmd = new SqlCommand("aspMenuInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("icono", data.icono);
                    cmd.Parameters.AddWithValue("url", data.url ?? "javascript:void(0)");
                    cmd.Parameters.AddWithValue("grupo", data.grupo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _gr.titleSms = "Agregar Menu";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idMenu, Menu data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspMenuUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idMenu", idMenu);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("icono", data.icono);
                    cmd.Parameters.AddWithValue("url", data.url);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.Parameters.AddWithValue("grupo", data.grupo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _gr.titleSms = "Actualizar Menu";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idMenu)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspMenuDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idMenu", idMenu);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _gr.titleSms = "Eliminar Menu";
            }
            finally
            {

            }
            return _gr;
        }

        ///OTHER METHODS CUSTOMIZED
        ///

        public async Task<GenericResponse> GetAccesosAsync()
        {
            var data = new AccesoTempDto();
            var menus = new List<MenuDto>();
            var subMenus = new List<SubMenuDto>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPAccesoGet", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var reader = cmd.ExecuteReader();
                        while (reader.Read())
                        {
                            var item = new MenuDto();
                            item.idMenu = reader.GetInt32(0);
                            item.url = reader.GetString(1);
                            item.icon = reader.GetString(2);
                            item.description = reader.GetString(3);
                            item.subMenu = reader.GetBoolean(4);
                            item.grupo = reader.GetString(5);
                            menus.Add(item);
                        }
                        reader.NextResult();
                        while (reader.Read())
                        {
                            var item = new SubMenuDto();
                            item.idMenu = reader.GetInt32(0);
                            item.url = reader.GetString(1);
                            item.icon = reader.GetString(2);
                            item.description = reader.GetString(3);
                            item.grupo = reader.GetString(4);
                            subMenus.Add(item);
                        }
                    }

                    data.menus = menus;
                    data.subMenus = subMenus;
                    _gr.id = "1";
                    _gr.data = data;
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            finally
            {


            }

            return _gr;
        }


    }
}