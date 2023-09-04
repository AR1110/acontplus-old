using System.Data;

namespace Common.Infrastructure.Repository
{
    public static class SqlTypes
    {
        public static SqlDbType GetDbType(object obj)
        {
            var type = obj.GetType();
            switch (type.Name)
            {
                case "Int32":
                    return SqlDbType.Int;
                case "Int64":
                    return SqlDbType.BigInt;
                case "String":
                    return SqlDbType.VarChar;
                case "Boolean":
                    return SqlDbType.Bit;
                case "Decimal":
                    return SqlDbType.Decimal;
                case "Guid":
                    return SqlDbType.UniqueIdentifier;
                case "XmlDocument":
                    return SqlDbType.Xml;
                case "Byte[]":
                    return SqlDbType.VarBinary;
                case "DateTime":
                    return SqlDbType.DateTime;
                default:
                    return SqlDbType.Variant;
            }
        }
    }
}
