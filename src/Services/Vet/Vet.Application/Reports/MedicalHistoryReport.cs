using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Vet.Core.Entities;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Application.Reports
{
    public class MedicalHistoryReport : IMedicalHistoryReport
    {
        private readonly VetContext _context;
        public MedicalHistoryReport(VetContext context)
        {
            _context = context;
        }
        public byte[] Get(int id)
        {
            byte[] data = null;
            DataSet dataSet = null;
            string query = @"SELECT * FROM Pet.MedicalHistory WHERE Id = @id
        SELECT * FROM Pet.HealthCheck WHERE MedicalHistoryId = @id
        SELECT * FROM Pet.BehaviorTest WHERE MedicalHistoryId = @id";
            //using (var context = new SampleContext())
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                SqlParameter paramId = new SqlParameter("id", SqlDbType.Int);
                paramId.Value = id;
                command.Parameters.Add(paramId);
                command.CommandType = CommandType.Text;
                _context.Database.OpenConnection();
                using (SqlDataAdapter adapter = new SqlDataAdapter())
                {
                    adapter.SelectCommand = (SqlCommand)command;

                    dataSet = new DataSet();
                    adapter.Fill(dataSet);
                }
            }
            //var history = _context.Database.SqlQueryRaw<MedicalHistory>("EXEC Pet.MedicalHistory_Report @id",
            //                                                              new SqlParameter("@id", id)
            //                                                              ).ToList();            //var medicalHistory = await _context.MedicalHistories.FindAsync(id);


            //var pet = medicalHistory.Pet;
            //var healtTests = medicalHistory.HealthChecks;

            return data;
        }
    }
}
