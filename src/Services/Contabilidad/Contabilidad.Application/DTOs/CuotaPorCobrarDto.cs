namespace Contabilidad.Application.DTOs;

public class CuotaPorCobrarDto
{
}

public class CuentaPorCobrarCuotaUpdateDto
{
    public int IdCuentaPorCobrar { get; set; }

    public int IdTiempoCredito { get; set; }

    public string FechaVencimiento { get; set; }
}


public class CuotaPorCobrarUpdateDto
{
    public int IdCuotaPorCobrar { get; set; }

    public string FechaVencimiento { get; set; }

    public decimal Cuota { get; set; }

    public decimal Interes { get; set; }

    public decimal Mora { get; set; }

    public int DiasMora { get; set; }
}


public class CuotaPorCobrarUpdateParamsDto
{
    public CuentaPorCobrarCuotaUpdateDto Cuenta { get; set; }
    public List<CuotaPorCobrarUpdateDto> Cuotas { get; set; }
}
