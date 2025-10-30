namespace Accounting.Application.DTOs;

public record CuentaPorCobrarCuotaUpdateDto(
    int IdCuentaPorCobrar,
    int IdTiempoCredito,
    string FechaVencimiento
);

public record CuotaPorCobrarUpdateDto(
    int IdCuotaPorCobrar,
    string FechaVencimiento,
    decimal Cuota,
    decimal Interes,
    decimal Mora,
    int DiasMora
);

public record CuotaPorCobrarUpdateParamsDto(
    CuentaPorCobrarCuotaUpdateDto Cuenta,
    List<CuotaPorCobrarUpdateDto> Cuotas
);

// New DTOs for CreditoGarante
public record CreditoGaranteDto(
    int IdCreditoGarante,
    int IdCuentaPorCobrar,
    int IdCliente
);

public record CreateCreditoGaranteDto(
    List<CreditoGaranteDto> Guarantors
);

public record UpdateCreditoGaranteDto(
    List<CreditoGaranteDto> Guarantors
);

public record CreditoGaranteDtos(
    CreateCreditoGaranteDto Create,
    UpdateCreditoGaranteDto Update
);
