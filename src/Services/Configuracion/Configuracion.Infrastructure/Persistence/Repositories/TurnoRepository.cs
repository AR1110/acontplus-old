namespace Configuracion.Infrastructure.Persistence.Repositories;

public class TurnoRepository(IAdoRepository repository) : ITurnoRepository
{
  public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await repository.GetDataSetAsync("Config.Turno_Get", parameters);
    var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();

    return DataValidation.DataTableIsNull(dt) ? new SpResponse { Code = "0", Message = "No data" } : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
  }

  public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await repository.QuerySingleOrDefaultAsync<SpResponse>("ASPTurnoCreate", parameters);
  }

  public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await repository.QuerySingleOrDefaultAsync<SpResponse>("ASPTurnoUpdate", parameters);
  }

  public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
  {
    return await repository.QuerySingleOrDefaultAsync<SpResponse>("ASPTurnoDelete", parameters);
  }
}

// public class TurnoRepository : ITurnoRepository
// {
//     private readonly IConfiguration _configuration;
//     private readonly string _connectionStrings = string.Empty;
//     private readonly IAdoRepository _repository;

//     public TurnoRepository(IAdoRepository respository, IConfiguration configuration)
//     {
//         _repository = respository;
//         _configuration = configuration;
//         _connectionStrings = _configuration.GetConnectionString("DefaultConnection");
//     }

//     public async Task<string> GetAsync(Dictionary<string, object> parameters)
//     {
//         var ds = await _repository.GetDataSetAsync("Config.Turno_Get", parameters);
//         var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
//         return !DataValidation.DataTableIsNull(dt) ? DataConverters.DataTableToJson(dt) : null;
//     }

//     public async Task<SpResponse> CreateTurnoAsync(int userRoleId, Turno data)
//     {
//         var response = new SpResponse
//         {
//             Code = "50001"
//         };
//         await using var con = new SqlConnection(_connectionStrings);
//         await using var cmd = new SqlCommand("ASPTurnoCreate", con);
//         cmd.Parameters.AddWithValue("userRoleId", userRoleId);
//         cmd.Parameters.AddWithValue("descripcion", data.Descripcion);
//         ////Horario del turno
//         var p = JsonExtensions.SerializeOptimized(data.Horarios);
//         cmd.Parameters.Add(new SqlParameter("json", p));
//         cmd.CommandType = CommandType.StoredProcedure;
//         await con.OpenAsync();
//         await using var reader = await cmd.ExecuteReaderAsync();
//         while (reader.Read())
//         {
//             response.Code = reader.GetString(0); // 0 -> Successful
//             response.Message = reader.GetString(1);
//         }

//         return response;
//     }

//     public async Task<SpResponse> UpdateTurnoAsync(int userRoleId, Turno data)
//     {
//         var response = new SpResponse
//         {
//             Code = "50001"
//         };
//         try
//         {
//             await using var con = new SqlConnection(_connectionStrings);
//             await using var cmd = new SqlCommand("ASPTurnoUpdate", con);
//             cmd.Parameters.AddWithValue("userRoleId", userRoleId);
//             cmd.Parameters.AddWithValue("idTurno", data.IdTurno);
//             cmd.Parameters.AddWithValue("descripcion", data.Descripcion);
//             cmd.Parameters.AddWithValue("estado", data.Estado);
//             var p = JsonExtensions.SerializeOptimized(data.Horarios);
//             cmd.Parameters.Add(new SqlParameter("json", p));
//             cmd.CommandType = CommandType.StoredProcedure;
//             await con.OpenAsync();
//             await using var reader = await cmd.ExecuteReaderAsync();
//             while (reader.Read())
//             {
//                 response.Code = reader.GetString(0); // 0 -> Successful
//                 response.Message = reader.GetString(1);
//             }
//         }
//         catch (Exception ex)
//         {
//             response.Code = "50001"; // 0 -> Successful
//             response.Message = ex.Message;
//         }

//         return response;
//     }

//     public async Task<SpResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize)
//     {
//         var response = new SpResponse
//         {
//             Code = "50001"
//         };
//         var listar = new List<TurnoViewModel>();
//         await using (var con = new SqlConnection(_connectionStrings))
//         {
//             await using (var cmd = new SqlCommand("ASPTurnoRead", con))
//             {
//                 cmd.Parameters.AddWithValue("userRoleId", userRoleId);
//                 cmd.Parameters.AddWithValue("pageIndex", pageIndex);
//                 cmd.Parameters.AddWithValue("pageSize", pageSize);
//                 cmd.CommandType = CommandType.StoredProcedure;
//                 await con.OpenAsync();
//                 await using (var reader = await cmd.ExecuteReaderAsync())
//                 {
//                     while (reader.Read())
//                     {
//                         // _gr.id = reader.GetString(0);
//                         // _gr.typeNotify = reader.GetString(1);
//                         // _gr.message = reader.GetString(2);
//                         // _gr.titleSms = reader.GetString(3);
//                         // switch (_gr.id)
//                         // {
//                         //     case "1":
//                         //     {
//                         //         var item = new TurnoViewModel
//                         //         {
//                         //             turno = new Turno
//                         //             {
//                         //                 idTurno = reader.GetInt32(4),
//                         //                 descripcion = reader.GetString(5),
//                         //                 estado = reader.GetBoolean(6)
//                         //             },
//                         //             totalRecords = reader.GetInt32(7)
//                         //         };
//                         //         listar.Add(item);
//                         //         break;
//                         //     }
//                         // }
//                     }
//                 }
//             }
//         }

//         // _gr.data = listar;
//         return response;
//     }

//     public async Task<SpResponse> DeleteTurnoAsync(int userRoleId, int idTurno)
//     {
//         var response = new SpResponse
//         {
//             Code = "50001"
//         };
//         await using (var con = new SqlConnection(_connectionStrings))
//         {
//             await using (var cmd = new SqlCommand("ASPTurnoDelete", con))
//             {
//                 cmd.Parameters.AddWithValue("userRoleId", userRoleId);
//                 cmd.Parameters.AddWithValue("idTurno", idTurno);
//                 cmd.CommandType = CommandType.StoredProcedure;
//                 await con.OpenAsync();
//                 await using (var reader = await cmd.ExecuteReaderAsync())
//                 {
//                     while (reader.Read())
//                     {
//                         response.Code = reader.GetString(0); // 0 -> Successful
//                         response.Message = reader.GetString(1);
//                     }
//                 }
//             }
//         }

//         return response;
//     }
// }
