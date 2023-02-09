using System;

namespace Helpers
{
    public class AutoComplete
    {
        DateTime startDate, endDate; 
        public string fillChars(string text, int num)
        {
            if (text.Length < num)
            {
                while (text.Length < num)
                {
                    text = '0' + text;
                }
            }
            return text;
        }

        public DateTime fllStartDate(int year, int month)
        {
            startDate = new DateTime(year, month, 1);
            return startDate;
        }

        public DateTime fillEndDate(int year, int month)
        {
            endDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            return endDate;
        }
    }
}
