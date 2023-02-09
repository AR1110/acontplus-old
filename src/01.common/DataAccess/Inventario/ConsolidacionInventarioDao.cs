
using Helpers;
using Domain.Models;
using Domain.Models.Inventario;
using Domain.ViewModels.Inventario;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Inventario
{
    public class ConsolidacionInventarioDao : ConnectionDb
    {
        private readonly IConfiguration _config;
        private GenericResponse _response;

        public ConsolidacionInventarioDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Inventario.ConsolidacionInventario_Get");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDataTable(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idConsolidacionInventario)
        {
            var consolidacion = new ConsolidacionInventarioViewModel();
            var detalle = new List<ConsolidacionInventarioDetalleViewModel>();
            var data = new ConsolidacionInventarioData();

            try
            {
                var cmd = new SqlCommand("aspConsolidacionInventarioGetId", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idConsolidacionInventario", idConsolidacionInventario);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                    if (_response.id == "1")
                    {
                        consolidacion.consolidacion = new ConsolidacionInventario()
                        {
                            idConsolidacionInventario = reader.GetInt64(3),
                            fechaEmision = reader.GetDateTime(4).ToString("yyyy-MM-dd"),
                            observacion = reader.GetString(5),
                            total = reader.GetDecimal(6),
                        };

                        reader.NextResult();
                        while (reader.Read())
                        {
                            var item = new ConsolidacionInventarioDetalleViewModel
                            {
                                detalle = new ConsolidacionInventarioDetalle()
                                {
                                    idConsolidacionInventarioDetalle = reader.GetInt64(0),
                                    idBodega = reader.GetInt32(1),
                                    idArticulo = reader.GetInt32(2),
                                    idMedida = reader.GetInt32(3),
                                    descripcion = reader.GetString(4),
                                    cantidad = reader.GetDecimal(5),
                                    precioCosto = reader.GetDecimal(6),
                                    precioActual = reader.GetDecimal(7),
                                },
                                codigo = reader.GetString(8),
                                codigoTipoIva = reader.GetString(9),
                                nombreTipoIva = reader.GetString(10),
                                stock = reader.GetDecimal(11),
                            };
                            detalle.Add(item);
                        }
                    }

                }
                data.consolidacion = consolidacion;
                data.detalle = detalle;
                _response.data = data;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Get id Consolidacion de Inventario";

            }
            finally
            {
                con.Close();
            }

            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, ConsolidacionInventarioViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("aspConsolidacionInventarioInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idPuntoEmision", data.consolidacion.idPuntoEmision);
                cmd.Parameters.AddWithValue("fechaEmision", data.consolidacion.fechaEmision);
                cmd.Parameters.AddWithValue("total", data.consolidacion.total);
                cmd.Parameters.AddWithValue("observacion", DataHelper.ToDBNullOrDefault(data.consolidacion.observacion));
                var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);

                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Consolidacion de Inventario";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idConsolidacionInventario, ConsolidacionInventarioViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("aspConsolidacionInventarioUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idConsolidacionInventario", idConsolidacionInventario);
                cmd.Parameters.AddWithValue("fechaEmision", data.consolidacion.fechaEmision);
                cmd.Parameters.AddWithValue("total", data.consolidacion.total);
                cmd.Parameters.AddWithValue("observacion", DataHelper.ToDBNullOrDefault(data.consolidacion.observacion));
                var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);

                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Actualizar Consolidacion de Inventario";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idConsolidacionInventario)
        {
            try
            {
                var cmd = new SqlCommand("aspConsolidacionInventarioDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idConsolidacionInventario", idConsolidacionInventario);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);

                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Eliminar Consolidacion de Inventario";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> GetIdAsync(int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Inventario.ConsolidacionInventario_Get_Id");
                db.AddParameter("id", SqlDbType.Int, id);
                DataSet ds = db.GetDataSet();
                _response = DbResponse.SPDataSet(ds);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
    }
}
