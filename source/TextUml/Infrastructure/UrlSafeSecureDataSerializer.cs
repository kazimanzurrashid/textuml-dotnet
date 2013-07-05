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
                    MemoryStream plainStream = null;
                    CryptoStream cryptoStream = null;
                    StreamWriter writer = null;

                    try
                    {
                        plainStream = new MemoryStream();
                        cryptoStream = new CryptoStream(
                            plainStream,
                            encryptor,
                            CryptoStreamMode.Write);

                        writer = new StreamWriter(cryptoStream);
                        writer.Write(plain);
                        writer.Flush();

                        var encrypted = Convert.ToBase64String(
                            plainStream.ToArray());

                        return encrypted;
                    }
                    finally
                    {
                        if (writer != null)
                        {
                            writer.Dispose();
                        }
                        else
                        {
                            if (cryptoStream != null)
                            {
                                cryptoStream.Dispose();
                            }
                            else
                            {
                                if (plainStream != null)
                                {
                                    plainStream.Dispose();
                                }
                            }
                        }
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
                    MemoryStream plainStream = null;
                    CryptoStream cryptoStream = null;
                    StreamReader reader = null;

                    try
                    {
                        plainStream = new MemoryStream(data);
                        cryptoStream = new CryptoStream(plainStream, decryptor, CryptoStreamMode.Read);
                        reader = new StreamReader(cryptoStream);

                        var plain = reader.ReadToEnd();

                        return plain;
                    }
                    finally
                    {
                        if (reader != null)
                        {
                            reader.Dispose();
                        }
                        else
                        {
                            if (cryptoStream != null)
                            {
                                cryptoStream.Dispose();
                            }
                            else
                            {
                                if (plainStream != null)
                                {
                                    plainStream.Dispose();
                                }
                            }
                        }
                    }
                }
            }
        }

        private SymmetricAlgorithm CreateCrypto()
        {
            var crypto = SymmetricAlgorithm.Create(algorithm);

            try
            {
                crypto.Key = key;
                crypto.IV = vector;
                crypto.Padding = PaddingMode.None;
            }
            catch
            {
                crypto.Dispose();
                throw;
            }

            return crypto;
        }
    }
}