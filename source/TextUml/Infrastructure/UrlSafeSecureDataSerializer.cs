namespace TextUml.Infrastructure
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Security.Cryptography;
    using System.Text;

    using Newtonsoft.Json;

    public interface IUrlSafeSecureDataSerializer
    {
        string Serialize<T>(T target);

        T Deserialize<T>(string payload);
    }

    public class UrlSafeSecureDataSerializer : IUrlSafeSecureDataSerializer
    {
        private readonly string algorithm;
        private readonly byte[] key;
        private readonly byte[] vector;

        public UrlSafeSecureDataSerializer(
            string algorithm,
            string key,
            string vector)
        {
            this.algorithm = algorithm;
            this.key = Encoding.Default.GetBytes(key);
            this.vector = Encoding.Default.GetBytes(vector);
        }

        public string Serialize<T>(T target)
        {
            var plain = SerializeData(target);
            var encrypted = EncryptData(plain);
            var encoded = UrlEncode(encrypted);

            return encoded;
        }

        public T Deserialize<T>(string payload)
        {
            var decoded = UrlDecode(payload);
            var plain = DecryptData(decoded);
            var data = DeserializeData<T>(plain);

            return data;
        }

        private static string SerializeData<T>(T target)
        {
            var result = new StringBuilder();

            using (var writer = new StringWriter(
                result, CultureInfo.CurrentCulture))
            {
                CreateSerializer().Serialize(writer, target);
            }

            return result.ToString();
        }

        private static T DeserializeData<T>(string payload)
        {
            using (var reader = new StringReader(payload))
            {
                return (T)CreateSerializer().Deserialize(reader, typeof(T));
            }
        }

        private static string UrlEncode(string value)
        {
            return value.Replace("/", "_").Replace("+", "-");
        }

        private static string UrlDecode(string value)
        {
            return value.Replace("_", "/").Replace("-", "+");
        }

        private static JsonSerializer CreateSerializer()
        {
            var settings = new JsonSerializerSettings();
            return JsonSerializer.Create(settings);
        }

        private string EncryptData(string plain)
        {
            using (var crypto = CreateCrypto())
            {
                using (var encryptor = crypto.CreateEncryptor(
                    crypto.Key,
                    crypto.IV))
                {
                    using (var buffer = new MemoryStream())
                    {
                        using (var writer = new StreamWriter(
                            new CryptoStream(
                                buffer,
                                encryptor,
                                CryptoStreamMode.Write)))
                        {
                            writer.Write(plain);
                        }

                        buffer.Flush();

                        var encrypted = Convert.ToBase64String(
                            buffer.ToArray());

                        return encrypted;
                    }
                }
            }
        }

        private string DecryptData(string encrypted)
        {
            var data = Convert.FromBase64String(encrypted);

            using (var crypto = CreateCrypto())
            {
                using (var decryptor = crypto.CreateDecryptor(
                    crypto.Key,
                    crypto.IV))
                {
                    using (var buffer = new MemoryStream(data))
                    {
                        using (var reader = new StreamReader(
                            new CryptoStream(
                                buffer,
                                decryptor,
                                CryptoStreamMode.Read)))
                        {
                            var plain = reader.ReadToEnd();

                            return plain;
                        }
                    }
                }
            }
        }

        private SymmetricAlgorithm CreateCrypto()
        {
            var crypto = SymmetricAlgorithm.Create(algorithm);

            crypto.Key = key;
            crypto.IV = vector;
            crypto.Padding = PaddingMode.None;

            return crypto;
        }
    }
}