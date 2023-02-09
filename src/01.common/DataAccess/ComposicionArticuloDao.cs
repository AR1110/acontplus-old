//using Domain.Models;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Threading.Tasks;

//namespace DataAccess
//{
//    public class ComposicionArticuloDao : ConnectionDb
//    {
//        protected GenericResponse _gr;
//        public ComposicionArticuloDao()
//        {
//            _gr= new GenericResponse();
//        }

//        public async Task<GenericResponse> CreateComposicionArticuloAsync(ComposicionArticuloOperaciones data, List<ComposicionArticuloDetalleOperaciones> dataDetalle)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloCreate", con);
//                cmd.Parameters.AddWithValue("idArticulo", data.articulo.idArticulo);
//                cmd.Parameters.AddWithValue("idArticuloPvP ", data.articuloPvP.idArticuloPvP);
//                cmd.Parameters.AddWithValue("precioVenta", data.articuloPvP.precioVenta);
//                cmd.Parameters.AddWithValue("imprimirDetalle", data.composicionArticulo.imprimirDetalle);
//                var p = JsonConvert.SerializeObject(dataDetalle);
//                cmd.Parameters.Add(new SqlParameter("json", p));
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();
//                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                {
//                    while (await reader.ReadAsync())
//                    {
//                        _gr.id = reader.GetString(0);
//                        _gr.typeNotify = reader.GetString(1);
//                        _gr.message = reader.GetString(2);
//                        _gr.titleSms = reader.GetString(3);
//                    }
//                }
//                con.Close();
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Registrar Composicion de Articulo";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> ReadComposicionArticuloAsync()
//        {
//            var listar = new List<ComposicionArticuloOperaciones>();
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloRead", con);
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();
//                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                {
//                    while (await reader.ReadAsync())
//                    {
//                        _gr.id = reader.GetString(0);
//                        _gr.typeNotify = reader.GetString(1);
//                        _gr.message = reader.GetString(2);
//                        _gr.titleSms = reader.GetString(3);
//                        if (_gr.id == "1")
//                        {
//                            var _cad = new ComposicionArticuloOperaciones
//                            {
//                                composicionArticulo = new ComposicionArticulo
//                                {
//                                    idComposicionArticulo = reader.GetInt32(4),
//                                    imprimirDetalle = reader.GetBoolean(5),
//                                    estado = reader.GetBoolean(6),
//                                    cantidadDetalle = reader.GetInt32(7)
//                                },
//                                articulo = new Articulo()
//                                {
//                                    idArticulo = reader.GetInt32(8),
//                                    descripcion = reader.GetString(9),
//                                    codigo = reader.GetString(10)
//                                },
//                                articuloPvP = new ArticuloPvP()
//                                {
//                                    idArticuloPvP = reader.GetInt32(11),
//                                    precioVenta = reader.GetDecimal(12),
//                                    precioCosto = reader.GetDecimal(13),
//                                    descripcion = reader.GetString(14),
//                                    porcentaje = reader.GetDecimal(15)
//                                }
//                            };
//                            listar.Add(_cad);
//                        }
//                    }
//                }
//                con.Close();
//                _gr.data = listar;
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Listar Composicion de Articulo";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> UpdateComposicionArticuloAsync(ComposicionArticuloOperaciones data)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloUpdate", con);
//                cmd.Parameters.AddWithValue("idComposicionArticulo", data.composicionArticulo.idComposicionArticulo);
//                cmd.Parameters.AddWithValue("idArticulo", data.articulo.idArticulo);
//                cmd.Parameters.AddWithValue("idArticuloPvP", data.articuloPvP.idArticuloPvP);
//                cmd.Parameters.AddWithValue("imprimirDetalle", data.composicionArticulo.imprimirDetalle);
//                cmd.Parameters.AddWithValue("estado", data.composicionArticulo.estado);
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();
//                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                {
//                    while (await reader.ReadAsync())
//                    {
//                        _gr.id = reader.GetString(0);
//                        _gr.typeNotify = reader.GetString(1);
//                        _gr.message = reader.GetString(2);
//                        _gr.titleSms = reader.GetString(3);
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Actualizar Composicion de Articulo";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> DeleteComposicionArticuloAsync(ComposicionArticuloOperaciones data)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloDelete", con);
//                cmd.Parameters.AddWithValue("idComposicionArticulo", data.composicionArticulo.idComposicionArticulo);
//                cmd.Parameters.AddWithValue("idArticuloPvP", data.articuloPvP.idArticuloPvP);
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();
//                SqlDataReader reader = await cmd.ExecuteReaderAsync();
//                while (await reader.ReadAsync())
//                {
//                    _gr.id = reader.GetString(0);
//                    _gr.typeNotify = reader.GetString(1);
//                    _gr.message = reader.GetString(2);
//                    _gr.titleSms = reader.GetString(3);
//                }
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Eliminar Composicion de Articulo";
//            }
//            return _gr;
//        }
//    }
//}