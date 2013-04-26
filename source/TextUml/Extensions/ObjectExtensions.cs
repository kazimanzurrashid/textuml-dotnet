namespace TextUml.Extensions
{
    using System;
    using System.ComponentModel;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Text;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public static class ObjectExtensions
    {
        private static readonly JsonSerializerSettings Settings =
            CreateSettings();

        private static readonly Func<string, object, object, object>
            DefaultConfictHandler = (key, oldValue, newValue) => newValue;
 
        public static string ToJson(this object instance)
        {
            if (instance == null)
            {
                return null;
            }

            var result = new StringBuilder();

            using (var writer = new StringWriter(
                result, CultureInfo.CurrentCulture))
            {
                JsonSerializer.Create(Settings).Serialize(writer, instance);
            }

            return result.ToString();
        }

        public static TTarget Merge<TTarget, TSource>(
            this TTarget target,
            TSource source,
            string[] includedProperties = null,
            string[] excludedProperties = null,
            Func<string, object, object, object> conflictHandler = null)
            where TTarget : class
            where TSource : class
        {
            var handler = conflictHandler ??
                          DefaultConfictHandler;

            var targetProperties = TypeDescriptor.GetProperties(target)
                .Cast<PropertyDescriptor>()
                .Where(p => !p.IsReadOnly)
                .Where(p =>
                    includedProperties == null ||
                    includedProperties.Contains(
                        p.Name, StringComparer.OrdinalIgnoreCase))
                .Where(p =>
                    excludedProperties == null ||
                    !excludedProperties.Contains(
                        p.Name, StringComparer.OrdinalIgnoreCase))
                .ToDictionary(d => d.Name, d => d);

            var sourceProperties = TypeDescriptor.GetProperties(source)
                .Cast<PropertyDescriptor>()
                .ToDictionary(d => d.Name, d => d);

            foreach (var property in targetProperties
                .Where(p => sourceProperties.ContainsKey(p.Key)))
            {
                var key = property.Key;

                var newValue = sourceProperties[key].GetValue(source);
                var oldValue = targetProperties[key].GetValue(target);

                if (newValue == oldValue)
                {
                    continue;
                }

                var value = handler(key, oldValue, newValue);

                targetProperties[key].SetValue(target, value);
            }

            return target;
        }

        private static JsonSerializerSettings CreateSettings()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            return settings;
        }
    }
}