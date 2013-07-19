namespace TextUml.Infrastructure
{
    using System;

    public static class Clock
    {
        private static Func<DateTime> utcNow = CreateFactory();

        public static Func<DateTime> UtcNow
        {
            get { return utcNow; }

            set { utcNow = value; }
        }

        public static void Reset()
        {
            utcNow = CreateFactory();
        }

        private static Func<DateTime> CreateFactory()
        {
            return () =>
            {
                var now = DateTime.UtcNow;

                return now;
            };
        }
    }
}