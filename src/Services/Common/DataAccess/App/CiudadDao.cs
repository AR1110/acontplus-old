using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.App
{
    public class CiudadDao
    {
        protected GenericResponse _response;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CiudadDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspCiudad_Get", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
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
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar Articulo";
            }
            finally
            {

            }
            return _response;
        }
        public GenericResponse listProvincia()
        {
            var listar = new List<Provincia>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("SPProvinciaList", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _response.id = reader.GetString(0);
                                _response.message = reader.GetString(1);
                                _response.titleSms = reader.GetString(2);

                                if (_response.id == "1")
                                {
                                    var pr = new Provincia();
                                    pr.idProvincia = Convert.ToInt32(reader["idProvincia"]);
                                    pr.descripcion = reader["descripcion"].ToString();
                                    listar.Add(pr);
                                }
                            }
                        }
                    }
                }
                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Provincia Listar";
            }
            return _response;
        }
        public GenericResponse listCiudad(Ciudad data)
        {
            var listar = new List<Ciudad>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("SPCiudadList", con))
                    {
                        cmd.Parameters.AddWithValue("@idProvincia", data.provincia.idProvincia);
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _response.id = reader.GetString(0);
                                _response.message = reader.GetString(1);
                                _response.titleSms = reader.GetString(2);
                                if (_response.id == "1")
                                {
                                    var c = new Ciudad();
                                    c.idCiudad = Convert.ToInt32(reader["idCiudad"]);
                                    c.descripcion = reader["descripcion"].ToString();
                                    listar.Add(c);
                                }
                            }
                        }
                    }
                }
                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = " Listar Cuidad Options";
            }
            return _response;
        }
        public GenericResponse ReadCiudad()
        {
            var listar = new List<Ciudad>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPReadCiudad", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.typeNotify = reader.GetString(1);
                        _response.message = reader.GetString(2);
                        _response.titleSms = reader.GetString(3);
                        if (_response.id == "1")
                        {
                            var c = new Ciudad();
                            c.idCiudad = reader.GetInt32(4);
                            c.descripcion = reader.GetString(5);
                            c.codigo = reader.GetString(6);
                            c.estado = reader.GetBoolean(7);
                            c.provincia = new Provincia()
                            {
                                idProvincia = reader.GetInt32(8),
                                descripcion = reader.GetString(9)
                            };
                            listar.Add(c);
                        }
                    }
                }
                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Listar Ciudad";
            }
            return _response;
        }
    }
}
