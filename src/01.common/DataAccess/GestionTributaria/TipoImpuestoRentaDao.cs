using Domain.Models.GestionTributaria;
using Domain.ViewModels.GestionTributaria;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.GestionTributaria
{
    public class TipoImpuestoRentaDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public TipoImpuestoRentaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }


        public async Task<GenericResponse> InsertAsync(TipoImpuestoRenta data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoImpuestoRentaInsert", con);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
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
                _gr.titleSms = "Registrar Tipo-Impuesto";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<TipoImpuestoRentaViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoImpuestoRentaGet", con);
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
                            var ti = new TipoImpuestoRentaViewModel
                            {
                                tipoImpuestoRenta = new TipoImpuestoRenta
                                {
                                    idTipoImpuestoRenta = reader.GetInt32(3),
                                    descripcion = reader.GetString(4),
                                    codigo = reader.GetString(5),
                                    estado = reader.GetBoolean(6),
                                },
                                totalRecords = reader.GetInt32(7)
                            };

                            listar.Add(ti);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Tipo-Impuesto";
            }
            finally
            {


            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idTipoImpuestoRenta, TipoImpuestoRenta data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoImpuestoRentaUpdate", con);
                    cmd.Parameters.AddWithValue("idTipoImpuestoRenta", idTipoImpuestoRenta);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
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
                _gr.titleSms = "Actualizar Tipo-Impuesto";

            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idTipoImpuestoRenta)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoImpuestoRentaDelete", con);
                    cmd.Parameters.AddWithValue("idTipoImpuestoRenta", idTipoImpuestoRenta);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
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
                _gr.titleSms = "Eliminar Tipo-Impuesto";
            }
            finally
            {


            }
            return _gr;
        }
        public async Task<GenericResponse> OptionAsync(int idRol, int idConfiguracionContribuyente)
        {
            var listar = new List<TipoImpuestoRenta>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoimpuestoRentaOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idConfiguracionContribuyente", idConfiguracionContribuyente);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);

                        if (_gr.id == "1")
                        {
                            var ti = new TipoImpuestoRenta()
                            {
                                idTipoImpuestoRenta = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                codigo = reader.GetString(5)
                            };

                            listar.Add(ti);
                        }
                    }
                }
                _gr.data = listar;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Tipo Impuesto Options";
            }
            finally
            {


            }
            return _gr;
        }
    }
}
