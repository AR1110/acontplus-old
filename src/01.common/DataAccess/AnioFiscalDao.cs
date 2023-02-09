using Domain.Models;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class AnioFiscalDao : ConnectionDb
    {
        protected GenericResponse _gr;
        public AnioFiscalDao()
        {
            _gr= new GenericResponse();
        }

        public async Task<GenericResponse> CreateAnioFiscalAsync(AnioFiscal data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPAnioFiscalCreate", con))
                {
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);

                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Año-Fiscal";
            }
            return _gr;

        }
        public async Task<GenericResponse> ReadAnioFiscal(int pageIndex, int pageSize)
        {
            var listar = new List<AnioFiscal>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPAnioFiscalRead", con))
                {
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);

                            if (_gr.id == "1")
                            {
                                var a = new AnioFiscal
                                {
                                    idAnioFiscal = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    estado = reader.GetBoolean(6),
                                    totalRecords = reader.GetInt32(7)
                                };
                                listar.Add(a);
                            }
                        }
                    }
                    con.Close();
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "AñoFiscal Listar";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAnioFiscalAsync(AnioFiscal data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPAnioFiscalUpdate", con))
                {
                    cmd.Parameters.AddWithValue("idAnioFiscal", data.idAnioFiscal);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Año-fiscal";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAnioFiscalAsync(AnioFiscal data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPAnioFiscalDelete", con))
                {
                    cmd.Parameters.AddWithValue("idAnioFiscal", data.idAnioFiscal);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Año-Fiscal";
            }
            return _gr;
        }

        public GenericResponse GetBy()
        {
            var lista = new List<AnioFiscal>();
            try
            {
                SqlCommand cmd = new SqlCommand("ASPAnioFiscalGetBy", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);
                    _gr.titleSms = reader.GetString(2);
                    if (_gr.id == "1")
                    {
                        var item = new AnioFiscal()
                        {
                            idAnioFiscal = reader.GetInt32(3),
                            descripcion = reader.GetString(4)
                        };
                        lista.Add(item);
                    }
                }
                con.Close();
                _gr.data = lista;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Año";
            }
            return _gr;
        }
    }
}
