//using Domain.Models;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Threading.Tasks;

//namespace DataAccess
//{
//    public class ComposicionArticuloDetalleDao : ConnectionDb
//    {
//        protected GenericResponse _gr;

//        public ComposicionArticuloDetalleDao()
//        {
//            _gr= new GenericResponse();
//        }

//        public async Task<GenericResponse> CreateComposicionArticuloDetalleAsync(ComposicionArticuloDetalleOperaciones data)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloDetalleCreate", con);
//                cmd.Parameters.AddWithValue("idComposicionArticulo", data.composicionArticulo.idComposicionArticulo);
//                cmd.Parameters.AddWithValue("idArticulo", data.articuloDetalle.idArticulo);
//                cmd.Parameters.AddWithValue("idArticuloPvPDetalle", data.articuloPvPDetalle.idArticuloPvP);
//                cmd.Parameters.AddWithValue("precioVentaDetalle", data.composicionArticuloDetalle.precioVenta);
//                cmd.Parameters.AddWithValue("cantidad", data.composicionArticuloDetalle.cantidad);
//                cmd.Parameters.AddWithValue("idArticuloPvP", data.articuloPvP.idArticuloPvP);

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
//                _gr.titleSms = "Registrar Detalle de Composicion";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> ReadComposicionArticuloDetalleAsync(ComposicionArticuloDetalleOperaciones data)
//        {
//            var listar = new List<ComposicionArticuloDetalleOperaciones>();
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloDetalleRead", con);
//                cmd.Parameters.AddWithValue("idComposicionArticulo", data.composicionArticulo.idComposicionArticulo);
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
//                            var _cad = new ComposicionArticuloDetalleOperaciones
//                            {
//                                composicionArticuloDetalle = new ComposicionArticuloDetalle()
//                                {
//                                    idComposicionArticuloDetalle = reader.GetInt32(4),
//                                    precioVenta = reader.GetDecimal(5),
//                                    cantidad = reader.GetInt32(6),
//                                    total = reader.GetDecimal(7)
//                                },
//                                articuloDetalle = new Articulo()
//                                {
//                                    idArticulo = reader.GetInt32(8),
//                                    descripcion = reader.GetString(9)
//                                },
//                                articuloPvP = new ArticuloPvP()
//                                {
//                                    idArticuloPvP = reader.GetInt32(10),
//                                    descripcion = reader.GetString(11)
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
//                _gr.titleSms = "Listar Composicion de Articulo Detalle";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> UpdateComposicionArticuloDetalleAsync(ComposicionArticuloDetalleOperaciones data)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloDetalleUpdate", con);
//                cmd.Parameters.AddWithValue("idComposicionArticuloDetalle", data.composicionArticuloDetalle.idComposicionArticuloDetalle);
//                cmd.Parameters.AddWithValue("idComposicionArticulo", data.composicionArticulo.idComposicionArticulo);
//                cmd.Parameters.AddWithValue("idArticulo", data.articuloDetalle.idArticulo);
//                cmd.Parameters.AddWithValue("idArticuloPvPDetalle", data.articuloPvPDetalle.idArticuloPvP);
//                cmd.Parameters.AddWithValue("precioVentaDetalle", data.composicionArticuloDetalle.precioVenta);
//                cmd.Parameters.AddWithValue("cantidad", data.composicionArticuloDetalle.cantidad);
//                cmd.Parameters.AddWithValue("idArticuloPvP", data.articuloPvP.idArticuloPvP);
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
//                _gr.titleSms = "Actualizar Detalle de Composicion";
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> DeleteComposicionArticuloDetalleAsync(ComposicionArticuloDetalleOperaciones data)
//        {
//            try
//            {
//                SqlCommand cmd = new SqlCommand("ASPComposicionArticuloDetalleDelete", con);
//                cmd.Parameters.AddWithValue("idComposicionArticuloDetalle", data.composicionArticuloDetalle.idComposicionArticuloDetalle);
//                cmd.Parameters.AddWithValue("idArticuloPvP", data.articuloPvP.idArticuloPvP);
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
//                _gr.titleSms = "Eliminar Detalle de Composicion";
//            }
//            return _gr;
//        }
//    }
//}