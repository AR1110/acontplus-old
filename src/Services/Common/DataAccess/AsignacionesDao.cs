//using Domain.Models;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Threading.Tasks;

//namespace DataAccess
//{
//    public class AsignacionesDao
//    {
//        protected GenericResponse _gr;

//        public AsignacionesDao()
//        {
//            _gr= new GenericResponse();
//        }

//        public async Task<GenericResponse> CreateAsignacionesAsync(asignacionesOperaciones data)
//        {
//            try
//            {
//                using (SqlCommand cmd = new SqlCommand("SPAsignacionesCreate", con))
//                {
//                    cmd.Parameters.AddWithValue("@idMenu", data.menu.idMenu);
//                    cmd.Parameters.AddWithValue("@idAcciones", data.acciones.idAcciones);
//                    cmd.CommandType = CommandType.StoredProcedure;
//                    await con.OpenAsync();
//                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                    {
//                        while (await reader.ReadAsync())
//                        {
//                            _gr.id = reader.GetString(0);
//                            _gr.typeNotify = reader.GetString(1);
//                            _gr.message = reader.GetString(2);
//                            _gr.titleSms = reader.GetString(3);
//                        }
//                    }
//                    
//                }
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Agregar Asignaciones";
//            }
//            return _gr;
//        }

//        public async Task<GenericResponse> ReadAsignacionesAsync(asignacionesOperaciones data)
//        {
//            var listar = new List<asignacionesOperaciones>();
//            try
//            {
//                using (SqlCommand cmd = new SqlCommand("SPAsignacionesRead", con))
//                {
//                    cmd.Parameters.AddWithValue("idMenu", data.menu.idMenu);
//                    cmd.CommandType = CommandType.StoredProcedure;
//                    await con.OpenAsync();
//                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                    {
//                        while (await reader.ReadAsync())
//                        {
//                            _gr.id = reader.GetString(0);
//                            _gr.typeNotify = reader.GetString(1);
//                            _gr.message = reader.GetString(2);
//                            _gr.titleSms = reader.GetString(3);
//                            if (_gr.id == "1")
//                            {
//                                var a = new asignacionesOperaciones();
//                                a.asignaciones = new Asignaciones()
//                                {
//                                    idAsignaciones = Convert.ToInt32(reader["idAsignaciones"]),
//                                    estado = Convert.ToBoolean(reader["estado"])
//                                };
//                                a.menu = new Menu()
//                                {
//                                    idMenu = Convert.ToInt32(reader["idMenu"]),
//                                };
//                                a.acciones = new Acciones()
//                                {
//                                    idAcciones = Convert.ToInt32(reader["idAcciones"])
//                                };
//                                listar.Add(a);
//                            }
//                        }
//                    }
//                    
//                }
//                _gr.data = listar;
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Listar Asignaciones";
//            }
//            return _gr;
//        }

//        public async Task<GenericResponse> UpdateAsignacionesAsync(asignacionesOperaciones data)
//        {
//            try
//            {
//                using (SqlCommand cmd = new SqlCommand("SPAsignacionesUpdate", con))
//                {
//                    cmd.Parameters.AddWithValue("@idAsignaciones", data.asignaciones.idAsignaciones);
//                    cmd.Parameters.AddWithValue("@estado", data.asignaciones.estado);
//                    cmd.CommandType = CommandType.StoredProcedure;
//                    await con.OpenAsync();
//                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
//                    {
//                        while (await reader.ReadAsync())
//                        {
//                            _gr.id = reader.GetString(0);
//                            _gr.typeNotify = reader.GetString(1);
//                            _gr.message = reader.GetString(2);
//                            _gr.titleSms = reader.GetString(3);
//                        }
//                    }
//                    

//                }
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.typeNotify = "warning";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Actualizar Asignaciones";
//            }
//            return _gr;
//        }

//    }
//}