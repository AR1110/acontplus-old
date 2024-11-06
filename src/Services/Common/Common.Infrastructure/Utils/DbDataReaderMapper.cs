using System.Reflection;

namespace Common.Infrastructure.Utils;

public static class DbDataReaderMapper
{
    public static List<T> ToList<T>(IDataReader rdr)
    {
        var ret = new List<T>();
        var typ = typeof(T);
        var properties = typ.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var columns = new Dictionary<string, PropertyInfo>();

        // Map columns to properties (case-insensitive)
        for (var index = 0; index < rdr.FieldCount; index++)
        {
            var columnName = rdr.GetName(index);
            var prop = properties.FirstOrDefault(p => string.Equals(p.Name, columnName, StringComparison.OrdinalIgnoreCase));
            if (prop != null)
            {
                columns.Add(columnName, prop);
            }
        }

        // Loop through all records
        while (rdr.Read())
        {
            // Create new instance of T
            var entity = Activator.CreateInstance<T>();

            // Assign values to the entity's properties
            foreach (var column in columns)
            {
                var property = column.Value;
                var columnValue = rdr[column.Key];

                if (columnValue != DBNull.Value)
                {
                    // Handle nullable types (if applicable)
                    var propertyType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

                    // Convert the column value to the property type if needed
                    var safeValue = Convert.ChangeType(columnValue, propertyType);

                    property.SetValue(entity, safeValue);
                }
                else
                {
                    property.SetValue(entity, null); // Handle DBNull
                }
            }

            ret.Add(entity);
        }

        return ret;
    }
}
