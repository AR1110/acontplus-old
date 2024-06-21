namespace Common.Infrastructure.Repository;

public static class SqlTypes
{
    public static SqlDbType GetDbType(object obj)
    {
        var type = obj.GetType();
        return type.Name switch
        {
            "Int32" => SqlDbType.Int,
            "Int64" => SqlDbType.BigInt,
            "String" => SqlDbType.VarChar,
            "Boolean" => SqlDbType.Bit,
            "Decimal" => SqlDbType.Decimal,
            "Guid" => SqlDbType.UniqueIdentifier,
            "XmlDocument" => SqlDbType.Xml,
            "Byte[]" => SqlDbType.VarBinary,
            "DateTime" => SqlDbType.DateTime,
            _ => SqlDbType.Variant
        };
    }
}

