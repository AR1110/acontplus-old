using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class TipoDocumentoDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _response;
        private readonly string _connectionStrings = string.Empty;

        public TipoDocumentoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();

        }
        public async Task<GenericResponse> GetAsync()
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTipoDocumentoGet", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = DataHelper.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> ReadTipoDocumentoAsync(HelpersResponse data)
        {
            var listar = new List<TipoDocumento>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTipoDocumentoRead", con);
                    cmd.Parameters.AddWithValue("tipoValidacion", data.tipoValidacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _response.id = reader.GetString(0);
                            _response.typeNotify = reader.GetString(1);
                            _response.message = reader.GetString(2);
                            _response.titleSms = reader.GetString(3);
                            if (_response.id == "1")
                            {
                                var _tp = new TipoDocumento()
                                {
                                    idTipoDocumento = (int)reader.GetInt64(4),
                                    descripcion = reader.GetString(5),
                                    codigo = reader.GetString(6)
                                };
                                listar.Add(_tp);
                            }
                        }
                    }
                }
                _response.data = listar;

            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message;
                _response.titleSms = "Listar TipoDocumento";
            }
            return _response;
        }
        //
        public async Task<GenericResponse> GetConfigurationAsync(int idRol, int idPuntoEmision)
        {
            var docs = new List<CDViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPConfiguracionDocumentoGet", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idPuntoEmision", idPuntoEmision);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var item = new CDViewModel();
                                item.configDoc = new ConfiguracionDocumento
                                {
                                    idConfiguracionDocumento = reader.GetInt32(0),
                                    idTipoDocumento = reader.GetInt64(1),
                                    generacionNro = reader.GetBoolean(2),
                                    ultimaSecuencia = reader.GetInt32(3)
                                };
                                item.nombreDoc = reader.GetString(4);
                                docs.Add(item);
                            }
                        }
                        _response.data = docs;
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
            }
            return _response;
        }
        public async Task<GenericResponse> SaveConfigAsync(int idRol, ConfiguracionDocumento data)
        {
            var docs = new List<CDViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPConfiguracionDocumentoInsert", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idConfiguracionDocumento", data.idConfiguracionDocumento);
                        cmd.Parameters.AddWithValue("idPuntoEmision", data.idPuntoEmision);
                        cmd.Parameters.AddWithValue("idTipoDocumento", data.idTipoDocumento);
                        cmd.Parameters.AddWithValue("generacionNro", data.generacionNro);
                        cmd.Parameters.AddWithValue("ultimaSecuencia", data.ultimaSecuencia);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _response.id = reader.GetString(0);
                                _response.message = reader.GetString(1);
                                _response.titleSms = reader.GetString(2);
                            }
                        }
                        _response.data = docs;
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
            }
            return _response;
        }

        public async Task<GenericResponse> GetByTTAsync(string codTransaccion)
        {
            var documents = new List<TipoDocumento>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoDocumentoRead", con);
                    cmd.Parameters.AddWithValue("tipoValidacion", codTransaccion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.typeNotify = reader.GetString(1);
                        _response.message = reader.GetString(2);
                        _response.titleSms = reader.GetString(3);
                        if (_response.id == "1")
                        {
                            var _tp = new TipoDocumento()
                            {
                                idTipoDocumento = (int)reader.GetInt64(4),
                                descripcion = reader.GetString(5),
                                codigo = reader.GetString(6)
                            };
                            documents.Add(_tp);
                        }
                    }
                }
                _response.data = documents;
            }
            catch (System.Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
            }
            return _response;
        }

        public async Task<GenericResponse> GetAllAsync()
        {
            var list = new List<TipoDocumento>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoDocumentoGetAll", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        var td = new TipoDocumento()
                        {
                            idTipoDocumento = (int)reader.GetInt64(0),
                            codigo = reader.GetString(1),
                            descripcion = reader.GetString(2)
                        };
                        list.Add(td);

                    }
                }
                _response.data = list;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Get List failed";
            }
            return _response;
        }
    }
}
