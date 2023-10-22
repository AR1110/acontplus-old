using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Utils
{
    public class ValidacionesExternas

    {
        protected GenericResponse _gr;
        public ValidacionesExternas()
        {
            _gr = new GenericResponse();
        }

        [HttpPost]
        internal GenericResponse VerificarDatos([FromBody] HelpersResponse data)
        {
            _ = new char[13];
            int provincia;
            int digito;
            try
            {
                switch (data.tipoValidacion)
                {
                    case "IDENTI":

                        if (data.numeroIdentificacion.Length >= 10)
                        {
                            char[] _valced = data.numeroIdentificacion.Trim().ToCharArray();
                            provincia = int.Parse(_valced[0].ToString() + _valced[1].ToString());

                            if (provincia > 0 && provincia < 25)
                            {
                                if (int.Parse(_valced[2].ToString()) < 6 && data.numeroIdentificacion.Length <= 10)
                                {
                                    VerificarCedula(_valced);
                                }

                                if (data.numeroIdentificacion.Length == 13)
                                {
                                    digito = int.Parse(_valced[10].ToString()) + int.Parse(_valced[11].ToString()) + int.Parse(_valced[12].ToString());

                                    if (digito == 001)
                                    {
                                        if (int.Parse(_valced[2].ToString()) < 6)
                                        {
                                            VerificarPersonaNarutal(_valced);
                                        }
                                        else if (int.Parse(_valced[2].ToString()) == 6)
                                        {
                                            VerificarSectorPublico(_valced);
                                        }
                                        else if (int.Parse(_valced[2].ToString()) == 9)
                                        {
                                            VerificarPersonaJuridica(_valced);
                                        }
                                    }
                                    else
                                    {
                                        _gr.id = "0";
                                        _gr.typeNotify = "is-invalid";
                                        _gr.message = "Los últimos tres dígitos de un Ruc siempre serán: 001";
                                    }
                                }
                            }
                            else
                            {
                                _gr.id = "0";
                                _gr.typeNotify = "is-invalid";
                                _gr.message = "Numero de identificacion fuera de los codigos de la Provincia";
                            }
                        }
                        else
                        {
                            _gr.id = "0";
                            _gr.typeNotify = "is-invalid";
                            _gr.message = "Cantidad de numeros no es correcta";
                        }
                        break;
                }



            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Validacion Externa";
            }

            return _gr;
        }
        public GenericResponse VerificarCedula(char[] validarCedula)
        {
            try
            {
                int aux = 0, par = 0, impar = 0, verifi;
                for (int i = 0; i < 9; i += 2)
                {
                    aux = 2 * int.Parse(validarCedula[i].ToString());
                    if (aux > 9)
                        aux -= 9;
                    par += aux;
                }
                for (int i = 1; i < 9; i += 2)
                {
                    impar += int.Parse(validarCedula[i].ToString());
                }
                aux = par + impar;
                if (aux % 10 != 0)
                {
                    verifi = 10 - (aux % 10);
                }
                else verifi = 0;

                if (verifi == int.Parse(validarCedula[9].ToString()))
                {
                    _gr.id = "1";
                    _gr.typeNotify = "is-valid";
                    _gr.message = "Cedula de Identidicación";
                }
                else
                {
                    _gr.id = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de Cedula ingresado incorrectamente";
                };
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Validadar Cedula";
            }

            return _gr;

        }
        public GenericResponse VerificarPersonaNarutal(char[] validarCedula)
        {
            try
            {
                int aux = 0, par = 0, impar = 0, verifi;
                for (int i = 0; i < 9; i += 2)
                {
                    aux = 2 * int.Parse(validarCedula[i].ToString());
                    if (aux > 9)
                        aux -= 9;
                    par += aux;
                }
                for (int i = 1; i < 9; i += 2)
                {
                    impar += int.Parse(validarCedula[i].ToString());
                }
                aux = par + impar;
                if (aux % 10 != 0)
                {
                    verifi = 10 - (aux % 10);
                }
                else verifi = 0;

                if (verifi == int.Parse(validarCedula[9].ToString()))
                {
                    _gr.id = "1";
                    _gr.typeNotify = "is-valid";
                    _gr.message = "Ruc Persona Natural";
                }
                else
                {
                    _gr.id = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Ruc de Persona Natural ingresado incorrectamente";
                };
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Validadar Ruc Persona Natural";
            }

            return _gr;

        }
        public GenericResponse VerificarPersonaJuridica(char[] validarCedula)
        {
            try
            {
                int aux = 0, prod, veri;
                veri = int.Parse(validarCedula[10].ToString()) + int.Parse(validarCedula[11].ToString()) + int.Parse(validarCedula[12].ToString());
                if (veri > 0)
                {
                    int[] coeficiente = new int[9] { 4, 3, 2, 7, 6, 5, 4, 3, 2 };
                    for (int i = 0; i < 9; i++)
                    {
                        prod = int.Parse(validarCedula[i].ToString()) * coeficiente[i];
                        aux += prod;
                    }
                    if (aux % 11 == 0)
                    {
                        veri = 0;
                    }
                    else if (aux % 11 == 1)
                    {
                        _gr.id = "0";
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
                        _gr.id = "1";
                        _gr.typeNotify = "is-valid";
                        _gr.message = "Ruc De Persona Juridica";
                    }
                    else
                    {
                        _gr.id = "0";
                        _gr.typeNotify = "is-invalid";
                        _gr.message = "Numero de identificacion Persona Juridica ingresado ingresado incorrectamente";
                    }
                }
                else
                {
                    _gr.id = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de identificacion Persona Juridica ingresado ingresado incorrectamente";
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Verificar Persona Juridica";
            }
            return _gr;
        }
        public GenericResponse VerificarSectorPublico(char[] validarCedula)
        {
            try
            {
                int aux = 0, prod, veri;
                veri = int.Parse(validarCedula[9].ToString()) + int.Parse(validarCedula[10].ToString()) + int.Parse(validarCedula[11].ToString()) + int.Parse(validarCedula[12].ToString());
                if (veri > 0)
                {
                    int[] coeficiente = new int[8] { 3, 2, 7, 6, 5, 4, 3, 2 };
                    for (int i = 0; i < 8; i++)
                    {
                        prod = int.Parse(validarCedula[i].ToString()) * coeficiente[i];
                        aux += prod;
                    }
                    if (aux % 11 == 0)
                    {
                        veri = 0;
                    }
                    else if (aux % 11 == 1)
                    {
                        _gr.id = "0";
                        _gr.typeNotify = "is-invalid";
                        _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
                    }
                    else
                    {
                        aux %= 11;
                        veri = 11 - aux;
                    }
                    if (veri == int.Parse(validarCedula[8].ToString()))
                    {
                        _gr.id = "1";
                        _gr.typeNotify = "is-valid";
                        _gr.message = "Ruc Del Sector Publico";
                    }
                    else
                    {
                        _gr.id = "0";
                        _gr.typeNotify = "is-invalid";
                        _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
                    }
                }
                else
                {
                    _gr.id = "0";
                    _gr.typeNotify = "is-invalid";
                    _gr.message = "Numero de identificacion Sector Publico ingresado incorrectamente";
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Verificar Sector Publico";
            }
            return _gr;
        }

    }
}
