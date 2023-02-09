using System.Text.RegularExpressions;

namespace Helpers
{
    public static class SqlValidation
    {
        public static string ValidateSqlString(string input)
        {
            Regex expression =
              new Regex(@";|=|<|>| or | and |select 
              | insert | update | drop | xp_ | --| exec"
            );

            string result =
              expression.Replace(input, new
              MatchEvaluator(MatchEvaluatorHandler));

            return result;
        }
        public static string MatchEvaluatorHandler(Match match)
        {
            //Replace the matched items with a blank string of 
            //equal length
            return new string(' ', match.Length);
        }
    }
}
