using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class TestDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TestDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public async Task<object[]> TestDateAsync(string dateTime, DateTime dateIntime)
        {
            object[] response = null;

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTestDate", con);
                    cmd.Parameters.AddWithValue("@datetest", dateTime);
                    cmd.Parameters.AddWithValue("@dateInTime", dateIntime);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (reader.Read())
                    {
                        response = new object[] { reader.GetString(0), reader.GetString(1) };
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                throw;
            }
            return response;
        }
    }
}
