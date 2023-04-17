using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net;
using System.Web;
using Domain.Dtos;

namespace BL.FactElect
{
    public class CCedulasSri
    {

        public string ConexionAInternet()
        {
            string Estado = "";
            Uri Url = new Uri("https://www.google.com/");

            System.Net.WebRequest WebRequest;
            WebRequest = System.Net.WebRequest.Create(Url);
            System.Net.WebResponse objetoResp;

            try
            {
                objetoResp = WebRequest.GetResponse();
                Estado = "Con Coneccion";
                objetoResp.Close();

                return Estado;
            }
            catch (Exception e)
            {
                Estado = "No se pudo conectar a Internet " + e.Message;
                return Estado;
            }

        }

        public bool CheckExistence(string cedula)
        {
            using (var client = new HttpClient(new HttpClientHandler() { Credentials = CredentialCache.DefaultNetworkCredentials }))
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-registro-civil-servicio-internet/rest/DatosRegistroCivil/existeNumeroIdentificacion?numeroIdentificacion=" + cedula),
                    Method = HttpMethod.Get
                };
                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
                //client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml");
                HttpResponseMessage response = client.SendAsync(request).Result;
                if (!response.IsSuccessStatusCode)
                {
                    return false;
                }

                Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
                Stream stream = streamTask.Result;
                var sr = new StreamReader(stream);
                var htmlResponse = HttpUtility.HtmlDecode(sr.ReadToEnd());
                if (htmlResponse == "true")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public CookieContainer GetCookie(ref string Html)
        {
            CookieContainer cookies = new CookieContainer();
            Random generator = new Random();
            String numeroGenerado = generator.Next(0, 100000000).ToString("D6");
            using (var client = new HttpClient(handler: new HttpClientHandler()
            {
                Credentials = CredentialCache.DefaultNetworkCredentials,
                UseCookies = true,
                CookieContainer = cookies
            }))
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/captcha/start/1?r=" + numeroGenerado),

                    Method = HttpMethod.Get
                };
                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");

                HttpResponseMessage response = client.SendAsync(request).Result;

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
                Stream stream = streamTask.Result;
                var sr = new StreamReader(stream);
                Html = HttpUtility.HtmlDecode(sr.ReadToEnd());
                return cookies;
            }
        }

        public string ValidateCaptcha(string Html, CookieContainer cookies)
        {
            CaptchaImage captchaImage;
            captchaImage = JsonConvert.DeserializeObject<CaptchaImage>(Html);
            string captcha = captchaImage.values[0].ToString();

            using (var client = new HttpClient(handler: new HttpClientHandler()
            {
                Credentials = CredentialCache.DefaultNetworkCredentials,
                UseCookies = true,
                CookieContainer = cookies

            }))
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/rest/ValidacionCaptcha/validarCaptcha/" + captcha + "?emitirToken=true"),
                    Method = HttpMethod.Get
                };
                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
                HttpResponseMessage response = client.SendAsync(request).Result;
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
                Stream stream = streamTask.Result;
                var sr = new StreamReader(stream);
                return HttpUtility.HtmlDecode(sr.ReadToEnd());
            }
        }


        public CCedulaSriDto GetCedulaSri(string NumeroCedula, CookieContainer cookies, string Html)
        {
            var PersonaDatosError = new CCedulaSriDto();
            //var estado = ConexionAInternet();
            //if (!estado.Equals("Con Coneccion"))
            //{
            //    PersonaDatosError.Error = "Sin Coneccion";
            //    return PersonaDatosError;
            //}
            //try
            //{
            //    using (var client = new HttpClient(new HttpClientHandler() { Credentials = CredentialCache.DefaultNetworkCredentials }))
            //    {
            //        var request = new HttpRequestMessage()
            //        {
            //            RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-registro-civil-servicio-internet/rest/DatosRegistroCivil/existeNumeroIdentificacion?numeroIdentificacion=" + NumeroCedula),
            //            Method = HttpMethod.Get
            //        };

            //        HttpResponseMessage response = client.SendAsync(request).Result;
            //        if (!response.IsSuccessStatusCode)
            //        {
            //            throw new Exception();
            //        }

            //        Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
            //        Stream stream = streamTask.Result;
            //        var sr = new StreamReader(stream);
            //        Html = HttpUtility.HtmlDecode(sr.ReadToEnd());
            //    }

            //}
            //catch (Exception ex)
            //{

            //    PersonaDatosError.Error = ex.ToString();
            //    return PersonaDatosError;
            //}

            //if (Html == "false")
            //{
            //    respuesta = "No existe Ruc";

            //}



            //try
            //{
            //    cookies = new CookieContainer();
            //    Random generator = new Random();
            //    String numeroGenerado = generator.Next(0, 100000000).ToString("D6");
            //    using (var client = new HttpClient(handler: new HttpClientHandler()
            //    {
            //        Credentials = CredentialCache.DefaultNetworkCredentials,
            //        UseCookies = true,
            //        CookieContainer = cookies
            //    }))
            //    {
            //        var request = new HttpRequestMessage()
            //        {
            //            RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/captcha/start/1?r=" + numeroGenerado),

            //            Method = HttpMethod.Get
            //        };
            //        client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");

            //        HttpResponseMessage response = client.SendAsync(request).Result;

            //        if (!response.IsSuccessStatusCode)
            //        {
            //            throw new Exception();
            //        }

            //        Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
            //        Stream stream = streamTask.Result;
            //        var sr = new StreamReader(stream);
            //        Html = HttpUtility.HtmlDecode(sr.ReadToEnd());
            //    }
            //}
            //catch (AggregateException ex)
            //{
            //    if (ex.InnerException is TaskCanceledException)
            //    {
            //        throw ex.InnerException;
            //    }
            //    else
            //    {
            //        throw ex;
            //    }
            //}


            //if (string.IsNullOrEmpty(Html))
            //{
            //    PersonaDatosError.Error = "Sin respuesta Catcha";
            //}
            //CaptchaImage captchaImage;
            //captchaImage = JsonConvert.DeserializeObject<CaptchaImage>(Html);
            //string captcha = captchaImage.values[0].ToString();

            //try
            //{
            //    using (var client = new HttpClient(handler: new HttpClientHandler()
            //    {
            //        Credentials = CredentialCache.DefaultNetworkCredentials,
            //        UseCookies = true,
            //        CookieContainer = cookies

            //    }))
            //    {
            //        var request = new HttpRequestMessage()
            //        {
            //            RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/rest/ValidacionCaptcha/validarCaptcha/" + captcha + "?emitirToken=true"),
            //            Method = HttpMethod.Get
            //        };
            //        client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
            //        HttpResponseMessage response = client.SendAsync(request).Result;
            //        if (!response.IsSuccessStatusCode)
            //        {
            //            throw new Exception();
            //        }

            //        Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
            //        Stream stream = streamTask.Result;
            //        var sr = new StreamReader(stream);
            //        Html = HttpUtility.HtmlDecode(sr.ReadToEnd());

            //    }

            //}

            //catch (Exception ex)
            //{

            //    respuesta = ex.ToString();
            //}

            Token objToken;

            objToken = JsonConvert.DeserializeObject<Token>(Html);

            string strtoken = objToken.mensaje.ToString();
            if (string.IsNullOrEmpty(Html))
            {
                PersonaDatosError.Error = " No existe contribuyente con ese Ruc";
                return PersonaDatosError;
            }

            //try
            //{
                using (var client = new HttpClient(handler: new HttpClientHandler()
                {
                    Credentials = CredentialCache.DefaultNetworkCredentials,
                    UseCookies = true,
                    CookieContainer = cookies

                }))
                {
                    var request = new HttpRequestMessage()
                    {
                        RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-registro-civil-servicio-internet/rest/DatosRegistroCivil/obtenerDatosCompletosPorNumeroIdentificacionConToken?numeroIdentificacion=" + NumeroCedula),
                        Method = HttpMethod.Get,

                    };
                    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
                    string _ContentType = "application/json";
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(_ContentType));
                    client.DefaultRequestHeaders.Add("Authorization", strtoken);
                    HttpResponseMessage response = client.SendAsync(request).Result;
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception();
                    }

                    Task<Stream> streamTask = response.Content.ReadAsStreamAsync();
                    Stream stream = streamTask.Result;
                    var sr = new StreamReader(stream);
                    Html = HttpUtility.HtmlDecode(sr.ReadToEnd());
                    Html = Html.Replace("[", "");
                    Html = Html.Replace("]", "");
                    PersonaDatosError = JsonConvert.DeserializeObject<CCedulaSriDto>(Html);
                    if (PersonaDatosError == null)
                    {
                        PersonaDatosError = new CCedulaSriDto();
                        PersonaDatosError.Error = " No existe contribuyente con ese Ruc";
                        return PersonaDatosError;
                    }
                    return PersonaDatosError;
                }

            //}
            //catch (Exception ex)
            //{
            //    PersonaDatosError = new CCedulaSriDto();
            //    PersonaDatosError.Error = ex.ToString();
            //    return PersonaDatosError;
            //}
        } 
    }
}
