using Common.Infrastructure.Repository;

namespace Common.Infrastructure.Utils;

public static class ParametersUtils
{
    public static void AddSqlParameter(DbCommand cmd, string name, object value)
    {
        var sqlParam = new SqlParameter
        {
            ParameterName = name, SqlDbType = SqlTypes.GetDbType(value), Value = value ?? DBNull.Value
        };
        cmd.Parameters.Add(sqlParam);
    }

    public static void AddSqlParameterOut(DbCommand cmd, string parameterName, SqlDbType sqlDbType, int size)
    {
        var sqlParam = new SqlParameter
        {
            ParameterName = parameterName, SqlDbType = sqlDbType, Size = size, Direction = ParameterDirection.Output
        };
        cmd.Parameters.Add(sqlParam);
    }

    public static object GetParameter(DbCommand command, string parameterName)
    {
        return command.Parameters[parameterName].Value;
    }
}
