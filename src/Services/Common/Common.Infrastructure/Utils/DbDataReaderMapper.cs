using System.Reflection;

namespace Common.Infrastructure.Utils;

public static class DbDataReaderMapper
{
    public static List<T> ToList<T>(IDataReader rdr)
    {
        var ret = new List<T>();
        var typ = typeof(T);
        var columns = new List<PropertyInfo>();
        // Get all the properties in Entity Class
        var props = typ.GetProperties();
        // Loop through one time to map columns to properties
        // NOTES:
        // Assumes your column names are the same name 
        // as your class property names
        // Any properties not in the data reader column list are not set
        for (var index = 0; index < rdr.FieldCount; index++)
        {
            // See if column name maps directly to property name
            var col = props.FirstOrDefault(c => c.Name == rdr.GetName(index));
            if (col != null)
            {
                columns.Add(col);
            }
        }

        // Loop through all records
        while (rdr.Read())
        {
            // Create new instance of Entity
            var entity = Activator.CreateInstance<T>();
            // Loop through columns to assign data
            foreach (var t in columns)
            {
                t.SetValue(entity, rdr[t.Name].Equals(DBNull.Value) ? null : rdr[t.Name], null);
            }

            ret.Add(entity);
        }

        return ret;
    }
}
