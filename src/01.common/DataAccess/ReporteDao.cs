using Domain.Dtos;
using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess
{
    public class ReporteDao 
    {
        private readonly IConfiguration _config;
        protected GenericResponse _resp;
        private readonly string _connectionStrings = string.Empty;

        public ReporteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _resp = new GenericResponse();

        }
        public async Task<GenericResponse> InsertAsync(int idRol, Reporte data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.Parameters.AddWithValue("reportPath", data.reportPath);
                    cmd.Parameters.AddWithValue("dataSource", data.dataSource);
                    cmd.Parameters.AddWithValue("contentType", data.contentType);
                    cmd.Parameters.AddWithValue("storedProcedure", data.storedProcedure);
                    cmd.Parameters.AddWithValue("fileName", data.nombreReporte);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _resp.id = reader.GetString(0);
                        _resp.message = reader.GetString(1);
                        _resp.titleSms = reader.GetString(2);

                    }
                }
            }
            catch (Exception ex)
            {
                _resp.id = "0";
                _resp.message = ex.Message.ToString();
                _resp.titleSms = "Registrar Reporte";

            }
            return _resp;
        }

        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var reports = new List<Reporte>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _resp.id = reader.GetString(0);
                        _resp.message = reader.GetString(1);
                        _resp.titleSms = reader.GetString(2);
                        if (_resp.id == "1")
                        {
                            var item = new Reporte();
                            item.idReporte = reader.GetInt32(3);
                            item.codigo = reader.GetString(4);
                            item.reportPath = reader.GetString(5);
                            item.contentType = reader.GetString(6);
                            item.dataSource = reader.GetString(7);
                            item.storedProcedure = reader.GetString(8);
                            item.nombreReporte = reader.GetString(9);
                            item.estado = reader.GetBoolean(10);
                            reports.Add(item);
                        }
                    }
                }
                _resp.data = reports;
            }
            catch (Exception ex)
            {
                _resp.id = "0";
                _resp.message = ex.Message.ToString();
                _resp.titleSms = "Get Reportes";
            }
            return _resp;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idReporte, Reporte data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idReporte", idReporte);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.Parameters.AddWithValue("reportPath", data.reportPath);
                    cmd.Parameters.AddWithValue("dataSource", data.dataSource);
                    cmd.Parameters.AddWithValue("contentType", data.contentType);
                    cmd.Parameters.AddWithValue("storedProcedure", data.storedProcedure);
                    cmd.Parameters.AddWithValue("fileName", data.nombreReporte);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _resp.id = reader.GetString(0);
                        _resp.message = reader.GetString(1);
                        _resp.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _resp.id = "0";
                _resp.message = ex.Message.ToString();
                _resp.titleSms = "Actualizar Reporte";
            }
            return _resp;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idReporte)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idReporte", idReporte);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _resp.id = reader.GetString(0);
                        _resp.message = reader.GetString(1);
                        _resp.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _resp.id = "0";
                _resp.message = ex.Message.ToString();
                _resp.titleSms = "Eliminar Reporte";
            }
            return _resp;
        }
        public bool GetByCodeAsync(ApiReportParams parameters, ref DataSet ds)
        {
            bool response = true;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteParametroGetByCode", con);
                    cmd.Parameters.AddWithValue("idRol", parameters.idRol);
                    cmd.Parameters.AddWithValue("json", parameters.reportParams);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(ds);
                }
            }
            catch (Exception ex)
            {
                _ = ex;
                response = false;
            }
            return response;
        }
        //OBTENEMOS LA INFORMACION PARA LLENAR EL REPORTE
        public DataSet GetDataToReport(int idRol, string storedProcedure, string jsonData)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand(storedProcedure, con); //PROCEDIMIENTO DE REPORTE DINAMICO
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", jsonData); //PARAMETROS DINAMICOS parameters: {}
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    var dataAdapter = new SqlDataAdapter();
                    dataAdapter.SelectCommand = cmd;
                    dataAdapter.Fill(ds);
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            return ds;
        }
    }
}
