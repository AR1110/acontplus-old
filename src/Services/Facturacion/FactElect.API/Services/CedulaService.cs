using System.Net.Http.Headers;
using System.Web;
using FactElect.API.Dtos;
using Newtonsoft.Json;

namespace FactElect.API.Services;

public class CedulaService
{
    public bool CheckExistence(string cedula)
    {
        using var client =
            new HttpClient(new HttpClientHandler { Credentials = CredentialCache.DefaultNetworkCredentials });
        var request = new HttpRequestMessage
        {
            RequestUri =
                new Uri(
                    "https://srienlinea.sri.gob.ec/sri-registro-civil-servicio-internet/rest/DatosRegistroCivil/existeNumeroIdentificacion?numeroIdentificacion=" +
                    cedula),
            Method = HttpMethod.Get
        };
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
        //client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml");
        var response = client.SendAsync(request).Result;
        if (!response.IsSuccessStatusCode)
        {
            return false;
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        var htmlResponse = HttpUtility.HtmlDecode(sr.ReadToEnd());
        return htmlResponse == "true";
    }

    public CookieContainer GetCookie(ref string html)
    {
        var cookies = new CookieContainer();
        var generator = new Random();
        var numeroGenerado = generator.Next(0, 100000000).ToString("D6");
        using var client = new HttpClient(new HttpClientHandler
        {
            Credentials = CredentialCache.DefaultNetworkCredentials, UseCookies = true, CookieContainer = cookies
        });
        var request = new HttpRequestMessage
        {
            RequestUri =
                new Uri("https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/captcha/start/1?r=" +
                        numeroGenerado),
            Method = HttpMethod.Get
        };
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");

        var response = client.SendAsync(request).Result;

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        html = HttpUtility.HtmlDecode(sr.ReadToEnd());
        return cookies;
    }

    public string ValidateCaptcha(string html, CookieContainer cookies)
    {
        var captchaImage = JsonConvert.DeserializeObject<CaptchaImage>(html);
        var captcha = captchaImage.values[0];

        using var client = new HttpClient(new HttpClientHandler
        {
            Credentials = CredentialCache.DefaultNetworkCredentials, UseCookies = true, CookieContainer = cookies
        });
        var request = new HttpRequestMessage
        {
            RequestUri =
                new Uri(
                    "https://srienlinea.sri.gob.ec/sri-captcha-servicio-internet/rest/ValidacionCaptcha/validarCaptcha/" +
                    captcha + "?emitirToken=true"),
            Method = HttpMethod.Get
        };
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
        var response = client.SendAsync(request).Result;
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        return HttpUtility.HtmlDecode(sr.ReadToEnd());
    }


    public CCedulaSriDto GetCedulaSri(string numeroCedula, CookieContainer cookies, string html)
    {
        var personaDatosError = new CCedulaSriDto();
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

        var objToken = JsonConvert.DeserializeObject<Token>(html);

        var strtoken = objToken.mensaje;
        if (string.IsNullOrEmpty(html))
        {
            personaDatosError.Error = " No existe contribuyente con ese Ruc";
            return personaDatosError;
        }

        //try
        //{
        using var client = new HttpClient(new HttpClientHandler
        {
            Credentials = CredentialCache.DefaultNetworkCredentials, UseCookies = true, CookieContainer = cookies
        });
        var request = new HttpRequestMessage
        {
            RequestUri =
                new Uri(
                    "https://srienlinea.sri.gob.ec/sri-registro-civil-servicio-internet/rest/DatosRegistroCivil/obtenerDatosCompletosPorNumeroIdentificacionConToken?numeroIdentificacion=" +
                    numeroCedula),
            Method = HttpMethod.Get
        };
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
        const string contentType = "application/json";
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(contentType));
        client.DefaultRequestHeaders.Add("Authorization", strtoken);
        var response = client.SendAsync(request).Result;
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception();
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        html = HttpUtility.HtmlDecode(sr.ReadToEnd());
        html = html.Replace("[", "");
        html = html.Replace("]", "");
        personaDatosError = JsonConvert.DeserializeObject<CCedulaSriDto>(html);
        if (personaDatosError == null)
        {
            personaDatosError = new CCedulaSriDto { Error = " No existe contribuyente con ese Ruc" };
            return personaDatosError;
        }

        return personaDatosError;

        //}
        //catch (Exception ex)
        //{
        //    PersonaDatosError = new CCedulaSriDto();
        //    PersonaDatosError.Error = ex.ToString();
        //    return PersonaDatosError;
        //}
    }
}
