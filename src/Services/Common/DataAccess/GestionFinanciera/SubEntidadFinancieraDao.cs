using System.Data;
using System.Data.SqlClient;
using Domain.Models.Tesoreria;
using Domain.ViewModels.Tesoreria;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Tesoreria
{
    public class SubEntidadFinancieraDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public SubEntidadFinancieraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> InsertAsync(int idRol, SubEntidadFinanciera data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPSubEntidadFinancieraInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEntidadFinanciera", data.idEntidadFinanciera);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.Parameters.AddWithValue("controlCaja", data.controlCaja);
                    cmd.Parameters.AddWithValue("interes", data.interes);
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
                _gr.titleSms = "Registrar Sub Entidad Financiera";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<SubEntidadFinancieraViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPSubEntidadFinancieraGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
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
                            var item = new SubEntidadFinancieraViewModel
                            {
                                subEntidadFinanciera = new SubEntidadFinanciera()
                                {
                                    idSubEntidadFinanciera = reader.GetInt32(3),
                                    idEntidadFinanciera = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    codigo = reader.GetString(6),
                                    interes = reader.GetDecimal(7),
                                    estado = reader.GetBoolean(8),
                                    controlCaja = reader.GetBoolean(9),
                                },
                                entidadFinanciera = reader.GetString(10),
                                totalRecords = reader.GetInt32(11)
                            };
                            listar.Add(item);
                        }
                    }
                }
                _gr.data = listar;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar SubEntidad Financiera";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idSubEntidadFinanciera, SubEntidadFinanciera data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPSubEntidadFinancieraUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idSubEntidadFinanciera", idSubEntidadFinanciera);
                    cmd.Parameters.AddWithValue("idEntidadFinanciera", data.idEntidadFinanciera);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.Parameters.AddWithValue("controlCaja", data.controlCaja);
                    cmd.Parameters.AddWithValue("interes", data.interes);
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
                _gr.titleSms = "Update Sub Entidad Financiera";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idSubEntidadFinanciera)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPSubEntidadFinancieraDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idSubEntidadFinanciera", idSubEntidadFinanciera);
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
                _gr.titleSms = "Delete Sub Entidad Financiera";
            }
            finally
            {

            }
            return _gr;
        }

        public async Task<GenericResponse> GetByEnFinacieraAsync(int idRol, int idEntidadFinanciera)
        {
            var list = new List<SubEntidadFinanciera>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPSubEntidadFinancieraGetByEntidad", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEntidadFinanciera", idEntidadFinanciera);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
                        {
                            var item = new SubEntidadFinanciera()
                            {
                                idSubEntidadFinanciera = reader.GetInt32(2),
                                descripcion = reader.GetString(3),
                                controlCaja = reader.GetBoolean(4),
                            };
                            list.Add(item);
                        }
                    }
                }
                _gr.data = list;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return _gr;
        }
    }
}
