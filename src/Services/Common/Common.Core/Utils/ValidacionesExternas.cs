namespace Common.Core.Utils;

public class ValidacionesExternas

{
    private readonly ApiResponseDeprecated _gr = new();

    internal ApiResponseDeprecated VerificarDatos(string numeroIdentificacion, string tipoValidacion)
    {
        _ = new char[13];
        try
        {
            switch (tipoValidacion)
            {
                case "IDENTI":

                    if (numeroIdentificacion.Length >= 10)
                    {
                        var valced = numeroIdentificacion.Trim().ToCharArray();
                        var provincia = int.Parse(valced[0] + valced[1].ToString());

                        if (provincia is > 0 and < 25)
                        {
                            if (int.Parse(valced[2].ToString()) < 6 && numeroIdentificacion.Length <= 10)
                            {
                                VerificarCedula(valced);
                            }

                            if (numeroIdentificacion.Length == 13)
                            {
                                var digito = int.Parse(valced[10].ToString()) + int.Parse(valced[11].ToString()) +
                                             int.Parse(valced[12].ToString());

                                if (digito == 001)
                                {
                                    switch (int.Parse(valced[2].ToString()))
                                    {
                                        case < 6:
                                            VerificarPersonaNarutal(valced);
                                            break;
                                        case 6:
                                            VerificarSectorPublico(valced);
                                            break;
                                        case 9:
                                            VerificarPersonaJuridica(valced);
                                            break;
                                    }
                                }
                                else
                                {
                                    _gr.code = "0";
                                    _gr.typeNotify = "is-invalid";
                                    _gr.message = "Los últimos tres dígitos de un Ruc siempre serán: 001";
                                }
                            }
                        }
                        else
                        {
                            _gr.code = "0";
                            _gr.typeNotify = "is-invalid";
                            _gr.message = "Numero de identificacion fuera de los codigos de la Provincia";
                        }
                    }
                    else
                    {
                        _gr.code = "0";
                        _gr.typeNotify = "is-invalid";
                        _gr.message = "Cantidad de numeros no es correcta";
                    }

                    break;
            }
        }
        catch (Exception ex)
        {
            _gr.code = "0";
            _gr.message = ex.Message;
            _gr.titleSms = "Validacion Externa";
        }

        return _gr;
    }

    private ApiResponseDeprecated VerificarCedula(char[] validarCedula)
    {
        try
        {
            int aux = 0, par = 0, impar = 0, verifi;
            for (var i = 0; i < 9; i += 2)
            {
                aux = 2 * int.Parse(validarCedula[i].ToString());
                if (aux > 9)
                {
                    aux -= 9;
                }

                par += aux;
            }

            for (var i = 1; i < 9; i += 2)
            {
                impar += int.Parse(validarCedula[i].ToString());
            }

            aux = par + impar;
            if (aux % 10 != 0)
            {
                verifi = 10 - (aux % 10);
            }
            else
            {
                verifi = 0;
            }

            if (verifi == int.Parse(validarCedula[9].ToString()))
            {
                _gr.code = "1";
                _gr.typeNotify = "is-valid";
                _gr.message = "Cedula de Identidicación";
            }
            else
            {
                _gr.code = "0";
                _gr.typeNotify = "is-invalid";
                _gr.message = "Numero de Cedula ingresado incorrectamente";
            }
        }
        catch (Exception ex)
        {
            _gr.code = "0";
            _gr.message = ex.Message;
            _gr.titleSms = "Validadar Cedula";
        }

        return _gr;
    }

    private ApiResponseDeprecated VerificarPersonaNarutal(char[] validarCedula)
    {
        try
        {
            int aux = 0, par = 0, impar = 0, verifi;
            for (var i = 0; i < 9; i += 2)
            {
                aux = 2 * int.Parse(validarCedula[i].ToString());
                if (aux > 9)
                {
                    aux -= 9;
                }

                par += aux;
            }

            for (var i = 1; i < 9; i += 2)
            {
                impar += int.Parse(validarCedula[i].ToString());
            }

            aux = par + impar;
            if (aux % 10 != 0)
            {
                verifi = 10 - (aux % 10);
            }
            else
            {
                verifi = 0;
            }

            if (verifi == int.Parse(validarCedula[9].ToString()))
            {
                _gr.code = "1";
                _gr.typeNotify = "is-valid";
                _gr.message = "Ruc Persona Natural";
            }
            else
            {
                _gr.code = "0";
                _gr.typeNotify = "is-invalid";
                _gr.message = "Ruc de Persona Natural ingresado incorrectamente";
            }
        }
        catch (Exception ex)
        {
            _gr.code = "0";
            _gr.message = ex.Message;
            _gr.titleSms = "Validadar Ruc Persona Natural";
        }

        return _gr;
    }

    private ApiResponseDeprecated VerificarPersonaJuridica(char[] validarCedula)
    {
        try
        {
            int aux = 0;
            var veri = int.Parse(validarCedula[10].ToString()) + int.Parse(validarCedula[11].ToString()) +
                       int.Parse(validarCedula[12].ToString());
            if (veri > 0)
            {
                var coeficiente = new int[] { 4, 3, 2, 7, 6, 5, 4, 3, 2 };
                for (var i = 0; i < 9; i++)
                {
                    var prod = int.Parse(validarCedula[i].ToString()) * coeficiente[i];
                    aux += prod;
                }

                if (aux % 11 == 0)
                {
                    veri = 0;
                }
                else if (aux % 11 == 1)
                {
                    _gr.code = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de identificacion Persona Juridica ingresado incorrectamente";
                }
                else
                {
                    aux %= 11;
                    veri = 11 - aux;
                }

                if (veri == int.Parse(validarCedula[9].ToString()))
                {
                    _gr.code = "1";
                    _gr.typeNotify = "is-valid";
                    _gr.message = "Ruc De Persona Juridica";
                }
                else
                {
                    _gr.code = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de identificacion Persona Juridica ingresado ingresado incorrectamente";
                }
            }
            else
            {
                _gr.code = "0";
                _gr.typeNotify = "is-invalid";
                _gr.message = "Numero de identificacion Persona Juridica ingresado ingresado incorrectamente";
            }
        }
        catch (Exception ex)
        {
            _gr.code = "0";
            _gr.message = ex.Message;
            _gr.titleSms = "Verificar Persona Juridica";
        }

        return _gr;
    }

    private ApiResponseDeprecated VerificarSectorPublico(char[] validarCedula)
    {
        try
        {
            int aux = 0;
            var veri = int.Parse(validarCedula[9].ToString()) + int.Parse(validarCedula[10].ToString()) +
                       int.Parse(validarCedula[11].ToString()) + int.Parse(validarCedula[12].ToString());
            if (veri > 0)
            {
                var coeficiente = new int[] { 3, 2, 7, 6, 5, 4, 3, 2 };
                for (var i = 0; i < 8; i++)
                {
                    var prod = int.Parse(validarCedula[i].ToString()) * coeficiente[i];
                    aux += prod;
                }

                switch (aux % 11)
                {
                    case 0:
                        veri = 0;
                        break;
                    case 1:
                        _gr.code = "0";
                        _gr.typeNotify = "is-invalid";
                        _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
                        break;
                    default:
                        aux %= 11;
                        veri = 11 - aux;
                        break;
                }

                if (veri == int.Parse(validarCedula[8].ToString()))
                {
                    _gr.code = "1";
                    _gr.typeNotify = "is-valid";
                    _gr.message = "Ruc Del Sector Publico";
                }
                else
                {
                    _gr.code = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
                }
            }
            else
            {
                _gr.code = "0";
                _gr.typeNotify = "is-invalid";
                _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
            }
        }
        catch (Exception ex)
        {
            _gr.code = "0";
            _gr.message = ex.Message;
            _gr.titleSms = "Verificar Sector Publico";
        }

        return _gr;
    }
}
