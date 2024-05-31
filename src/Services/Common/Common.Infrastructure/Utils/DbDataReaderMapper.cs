using System.Reflection;

namespace Common.Infrastructure.Utils;

public class DbDataReaderMapper
{
    public virtual List<T> ToList<T>(IDataReader rdr)
    {
        var ret = new List<T>();
        T entity;
        var typ = typeof(T);
        PropertyInfo col;
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
            col = props.FirstOrDefault(c => c.Name == rdr.GetName(index));
            if (col != null)
            {
                columns.Add(col);
            }
        }

        // Loop through all records
        while (rdr.Read())
        {
            // Create new instance of Entity
            entity = Activator.CreateInstance<T>();
            // Loop through columns to assign data
            for (var i = 0; i < columns.Count; i++)
            {
                if (rdr[columns[i].Name].Equals(DBNull.Value))
                {
                    columns[i].SetValue(entity, null, null);
                }
                else
                {
                    columns[i].SetValue(entity, rdr[columns[i].Name], null);
                }
            }

            ret.Add(entity);
        }

        return ret;
    }
}
