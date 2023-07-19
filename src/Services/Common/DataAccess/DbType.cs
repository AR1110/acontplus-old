using System.Data;
namespace DataAccess
{
    static class DbType
    {
        //https://ajaxhispano.com/ask/alguien-tiene-una-funcion-c-que-mapee-el-tipo-de-datos-sql-de-una-columna-a-su-equivalente-clr-58667/
        public static SqlDbType Get(object obj)
        {
            Type type = obj.GetType();
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
