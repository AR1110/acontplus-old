using System.Text;

namespace Common.Core.Utils
{
    public static class TextHandlers
    {
        public static string StringSplit(string input, int length)
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < input.Length; i++)
                {
                    sb.Append(input[i]);
                    if ((i + 1) % length == 0)
                    {
                        sb.Append("\\n");
                    }
                }

                string output = sb.ToString();
                return output;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
