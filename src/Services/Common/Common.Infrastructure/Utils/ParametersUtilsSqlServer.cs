using Common.Infrastructure.Repository;

namespace Common.Infrastructure.Utils;

public static class ParametersUtilsSqlServer
{
    public static void AddSqlParameter(SqlCommand cmd, string name, object value)
    {
        var sqlParam = new SqlParameter
        {
            ParameterName = name, SqlDbType = SqlTypes.GetDbType(value), Value = value ?? DBNull.Value
        };
        cmd.Parameters.Add(sqlParam);
    }

    public static void AddSqlParameterOut(SqlCommand cmd, string parameterName, SqlDbType sqlDbType, int size)
    {
        var sqlParam = new SqlParameter
        {
            ParameterName = parameterName, SqlDbType = sqlDbType, Size = size, Direction = ParameterDirection.Output
        };
        cmd.Parameters.Add(sqlParam);
    }

    public static object GetParameter(SqlCommand command, string parameterName)
    {
        return command.Parameters[parameterName].Value;
    }
}
