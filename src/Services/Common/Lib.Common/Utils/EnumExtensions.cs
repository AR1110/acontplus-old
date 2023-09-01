using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Lib.Common.Utils
{
    public static class EnumExtensions
    {
        public static string DisplayName(this Enum value)
        {
            var type = value.GetType();

            var memInfo = type.GetMember(value.ToString());

            if (memInfo.Length > 0)
            {
                var attrs = memInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (attrs.Length > 0)
                    return ((DescriptionAttribute)attrs[0]).Description;
            }

            return value.ToString();
        }

    }
}
