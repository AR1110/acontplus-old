using System.Text;

namespace Common.Core.Utils;

public static class TextHandlers
{
    public static string StringSplit(string input, int length)
    {
        var sb = new StringBuilder();

        for (var i = 0; i < input.Length; i++)
        {
            sb.Append(input[i]);
            if ((i + 1) % length == 0)
            {
                sb.Append("\\n");
            }
        }

        var output = sb.ToString();
        return output;
    }
}
