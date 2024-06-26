using System.Net.Http.Headers;
using System.Web;
using FactElect.API.Dtos;
using Newtonsoft.Json;

namespace FactElect.API.Services;

public class RucService
{
    public bool CheckExistence(string ruc)
    {
        using var client =
            new HttpClient(new HttpClientHandler { Credentials = CredentialCache.DefaultNetworkCredentials });
        var request = new HttpRequestMessage
        {
            RequestUri =
                new Uri(
                    "https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/existePorNumeroRuc?numeroRuc=" +
                    ruc),
            Method = HttpMethod.Get
        };
        client.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0");
        var response = client.SendAsync(request).Result;
        if (!response.IsSuccessStatusCode)
        {
            return false;
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        var html = HttpUtility.HtmlDecode(sr.ReadToEnd());
        return html == "true";
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
            throw new Exception();
        }

        var streamTask = response.Content.ReadAsStreamAsync();
        var stream = streamTask.Result;
        var sr = new StreamReader(stream);
        return HttpUtility.HtmlDecode(sr.ReadToEnd());
    }

    public DatosPersonaSriUpdate GetRucSri(string numeroRuc, CookieContainer cookies, string html)
    {
        var personaDatosError = new DatosPersonaSriUpdate();
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
        //            RequestUri = new Uri("https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/existePorNumeroRuc?numeroRuc=" + numeroRuc),
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
        using (var client = new HttpClient(new HttpClientHandler
               {
                   Credentials = CredentialCache.DefaultNetworkCredentials,
                   UseCookies = true,
                   CookieContainer = cookies
               }))
        {
            var request = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        "https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc?&ruc=" +
                        numeroRuc),
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
            //Html = Html.Replace("[", "");
            //Html = Html.Replace("]", "");
            var respSri = JsonConvert.DeserializeObject<List<DatosPersonaSriUpdate>>(html);
            personaDatosError = respSri[0];
            if (personaDatosError == null)
            {
                personaDatosError = new DatosPersonaSriUpdate { Error = " No existe contribuyente con ese Ruc" };
                return personaDatosError;
            }
        }

        //}
        //catch (Exception ex)
        //{
        //    PersonaDatosError = new DatosPersonaSriUpdate();
        //    PersonaDatosError.Error = ex.ToString();
        //    return PersonaDatosError;
        //}


        //try
        //{
        using (var client = new HttpClient(new HttpClientHandler
               {
                   Credentials = CredentialCache.DefaultNetworkCredentials,
                   UseCookies = true,
                   CookieContainer = cookies
               }))
        {
            var request = new HttpRequestMessage
            {
                RequestUri =
                    new Uri(
                        "https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/Establecimiento/consultarPorNumeroRuc?numeroRuc=" +
                        numeroRuc),
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
            var personaEstablecimientos = JsonConvert.DeserializeObject<List<Establecimiento>>(html);
            if (personaDatosError == null)
            {
                personaDatosError = new DatosPersonaSriUpdate();

                personaDatosError.Error = " No existe contribuyente con ese Ruc";
                return personaDatosError;
            }

            if (personaEstablecimientos.Count > 0)
            {
                personaDatosError.Establecimientos = personaEstablecimientos;
            }
        }

        //}
        //catch (Exception ex)
        //{
        //    PersonaDatosError = new DatosPersonaSriUpdate();

        //    PersonaDatosError.Error = ex.ToString();
        //    return PersonaDatosError;
        //}

        return personaDatosError;
    }
}
