namespace TextUml
{
    using System;

    using Elmah.Mvc;

    public static class ElmahConfig
    {
        public static void Register()
        {
            try
            {
                Bootstrap.Initialize();
            }
            catch (ArgumentException)
            {
                // Elmag.Mvc throws duplicate route name
            }
        }
    }
}