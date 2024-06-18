namespace Common.Core.Utils;

public static class DataTableMapper
{
    //use Foo foo = BindData<Foo>(dt);
    public static T BindData<T>(DataTable dt)
    {
        var dr = dt.Rows[0];

        // Get all columns' name
        var columns = (from DataColumn dc in dt.Columns select dc.ColumnName).ToList();

        // Create object
        var ob = Activator.CreateInstance<T>();

        // Get all fields
        var fields = typeof(T).GetFields();
        foreach (var fieldInfo in fields)
        {
            if (columns.Contains(fieldInfo.Name))
            {
                // Fill the data into the field
                fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
            }
        }

        // Get all properties
        var properties = typeof(T).GetProperties();
        foreach (var propertyInfo in properties)
        {
            if (columns.Contains(propertyInfo.Name))
            {
                // Fill the data into the property
                propertyInfo.SetValue(ob, dr[propertyInfo.Name]);
            }
        }

        return ob;
    }

    //use List<Foo> lst = BindDataList<Foo>(dt);
    public static List<T> BindDataList<T>(DataTable dt)
    {
        var columns = (from DataColumn dc in dt.Columns select dc.ColumnName).ToList();

        var fields = typeof(T).GetFields();
        var properties = typeof(T).GetProperties();

        var lst = new List<T>();

        foreach (DataRow dr in dt.Rows)
        {
            var ob = Activator.CreateInstance<T>();

            foreach (var fieldInfo in fields)
            {
                if (columns.Contains(fieldInfo.Name))
                {
                    fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
                }
            }

            foreach (var propertyInfo in properties)
            {
                if (columns.Contains(propertyInfo.Name))
                {
                    propertyInfo.SetValue(ob, dr[propertyInfo.Name]);
                }
            }

            lst.Add(ob);
        }

        return lst;
    }
}
