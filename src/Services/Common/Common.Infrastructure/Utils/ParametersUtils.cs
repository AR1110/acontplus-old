using System.Data;
using System.Data.Common;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;

namespace Common.Infrastructure.Utils
{
    public static class ParametersUtils
    {
        public static void AddSqlParameter(DbCommand cmd, string name, object value)
        {
            SqlParameter sqlParam = new SqlParameter();
            sqlParam.ParameterName = name;
            sqlParam.SqlDbType = SqlTypes.GetDbType(value);
            sqlParam.Value = value ?? DBNull.Value;
            cmd.Parameters.Add(sqlParam);
        }
        public static void AddSqlParameterOut(DbCommand cmd, string parameterName, SqlDbType sqlDbType, int size)
        {
            SqlParameter sqlParam = new SqlParameter();
            sqlParam.ParameterName = parameterName;
            sqlParam.SqlDbType = sqlDbType;
            sqlParam.Size = size;
            sqlParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(sqlParam);
        }
        public static object GetParameter(DbCommand command, string parameterName)
        {
            return command.Parameters[parameterName].Value;
        }
    }
}
