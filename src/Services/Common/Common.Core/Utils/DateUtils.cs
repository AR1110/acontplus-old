namespace Common.Core.Utils
{
    public static class DateUtils
    {
        public static DateTime GetEcuadorDate()
        {
            DateTime currentTime = DateTime.Now;
            TimeZoneInfo ecuadorZone = TimeZoneInfo.FindSystemTimeZoneById("SA Pacific Standard Time");
            DateTime ecuadorTime = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(currentTime, ecuadorZone.Id);
            return ecuadorTime;
        }
    }
}
