
using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Domain.Models;
using Domain.Models.Administracion;
using Domain.ViewModels;
using Domain.ViewModels.Administracion;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionFinanciera
{
    public class CajaDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CajaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<CajaViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspCajaGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                        if (_response.id == "1")
                        {
                            var item = new CajaViewModel
                            {
                                caja = new Caja()
                                {
                                    idCaja = reader.GetInt32(3),
                                    descripcion = reader.GetString(4),
                                    estado = reader.GetBoolean(5),
                                },
                                conectado = reader.GetString(6),
                                usuarioAsignado = reader.GetString(7),
                                turno = reader.GetString(8),
                                idTurno = reader.GetInt32(9),
                                totalRecords = reader.GetInt32(10),
                            };
                            listar.Add(item);
                        }
                    }
                }
                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Listar Caja";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Caja data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspCajaInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Caja";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idCaja, Caja data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspCajaUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCaja", idCaja);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Actualizar Caja";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idCaja)
        {

            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspCajaDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCaja", idCaja);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Eliminar Caja";
            }
            finally
            {

            }
            return _response;
        }

        //get para traer solo la caja asignada al usuario
        public async Task<GenericResponse> GetAsigAsync(int idRol)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspCajaGetAsig", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Get Caja asignada al usuario";
            }
            finally
            {

            }
            return _response;
        }

    }
}
