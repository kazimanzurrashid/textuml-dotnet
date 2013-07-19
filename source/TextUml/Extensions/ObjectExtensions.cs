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
            TSource source) where TTarget : class where TSource : class
        {
            return Merge(target, source, null, null, DefaultConfictHandler);
        }

        public static TTarget Merge<TTarget, TSource>(
            this TTarget target,
            TSource source,
            string[] includedProperties)
            where TTarget : class
            where TSource : class
        {
            return Merge(
                target,
                source,
                includedProperties,
                null,
                DefaultConfictHandler);
        }

        public static TTarget Merge<TTarget, TSource>(
            this TTarget target,
            TSource source,
            string[] includedProperties,
            Func<string, object, object, object> conflictHandler)
            where TTarget : class
            where TSource : class
        {
            return Merge(
                target,
                source,
                includedProperties,
                null,
                conflictHandler);
        }

        public static TTarget Merge<TTarget, TSource>(
            this TTarget target,
            TSource source,
            string[] includedProperties,
            string[] excludedProperties)
            where TTarget : class
            where TSource : class
        {
            return Merge(
                target,
                source,
                includedProperties,
                excludedProperties,
                DefaultConfictHandler);
        }

        public static TTarget Merge<TTarget, TSource>(
            this TTarget target,
            TSource source,
            string[] includedProperties,
            string[] excludedProperties,
            Func<string, object, object, object> conflictHandler)
            where TTarget : class
            where TSource : class
        {
            if (target == null)
            {
                throw new ArgumentNullException("target");
            }

            if (source == null)
            {
                throw new ArgumentNullException("source");
            }

            if (conflictHandler == null)
            {
                throw new ArgumentNullException("conflictHandler");
            }

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

                var value = conflictHandler(key, oldValue, newValue);

                targetProperties[key].SetValue(target, value);
            }

            return target;
        }

        private static JsonSerializerSettings CreateSettings()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                DateTimeZoneHandling = DateTimeZoneHandling.Utc
            };

            return settings;
        }
    }
}