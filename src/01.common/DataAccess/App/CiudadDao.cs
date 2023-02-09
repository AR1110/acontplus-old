using Helpers;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class CiudadDao
    {
        protected GenericResponse _response;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CiudadDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspCiudad_Get", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
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
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPProvinciaList", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
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
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPCiudadList", con))
                    {
                        cmd.Parameters.AddWithValue("@idProvincia", data.provincia.idProvincia);
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
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
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReadCiudad", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
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
