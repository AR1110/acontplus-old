# .NET 10.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that a .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade src\Services\Purchases\Purchases.Domain\Purchases.Domain.csproj
4. Upgrade src\Services\Billing\Billing.Domain\Billing.Domain.csproj
5. Upgrade src\Services\Sales\Sales.Domain\Sales.Domain.csproj
6. Upgrade src\Services\Inventory\Inventory.Domain\Inventory.Domain.csproj
7. Upgrade src\Services\Configuration\Configuration.Domain\Configuration.Domain.csproj
8. Upgrade src\Services\Accounting\Accounting.Domain\Accounting.Domain.csproj
9. Upgrade src\Services\Vet\Vet.Domain\Vet.Domain.csproj
10. Upgrade src\Services\TechnicalSupport\TechnicalSupport.Domain\TechnicalSupport.Domain.csproj
11. Upgrade src\Services\Restaurant\Restaurant.Domain\Restaurant.Domain.csproj
12. Upgrade src\Services\Mechanical\Mechanical.Domain\Mechanical.Domain.csproj
13. Upgrade src\Services\Loyalty\Loyalty.Domain\Loyalty.Domain.csproj
14. Upgrade src\Services\Common\Common.Domain\Common.Domain.csproj
15. Upgrade src\Services\BarberShop\BarberShop.Domain\BarberShop.Domain.csproj
16. Upgrade src\Services\Purchases\Purchases.Application\Purchases.Application.csproj
17. Upgrade src\Services\Purchases\Purchases.Infrastructure\Purchases.Infrastructure.csproj
18. Upgrade src\Services\Billing\Billing.Application\Billing.Application.csproj
19. Upgrade src\Services\Billing\Billing.Infrastructure\Billing.Infrastructure.csproj
20. Upgrade src\Services\Sales\Sales.Application\Sales.Application.csproj
21. Upgrade src\Services\Sales\Sales.Infrastructure\Sales.Infrastructure.csproj
22. Upgrade src\Services\Inventory\Inventory.Infrastructure\Inventory.Infrastructure.csproj
23. Upgrade src\Services\Inventory\Inventory.Application\Inventory.Application.csproj
24. Upgrade src\Services\Configuration\Configuration.Infrastructure\Configuration.Infrastructure.csproj
25. Upgrade src\Services\Configuration\Configuration.Application\Configuration.Application.csproj
26. Upgrade src\Services\Accounting\Accounting.Infrastructure\Accounting.Infrastructure.csproj
27. Upgrade src\Services\Accounting\Accounting.Application\Accounting.Application.csproj
28. Upgrade src\Services\Vet\Vet.Application\Vet.Application.csproj
29. Upgrade src\Services\Vet\Vet.Infrastructure\Vet.Infrastructure.csproj
30. Upgrade src\Services\TechnicalSupport\TechnicalSupport.Application\TechnicalSupport.Application.csproj
31. Upgrade src\Services\TechnicalSupport\TechnicalSupport.Infrastructure\TechnicalSupport.Infrastructure.csproj
32. Upgrade src\Services\Restaurant\Restaurant.Infrastructure\Restaurant.Infrastructure.csproj
33. Upgrade src\Services\Restaurant\Restaurant.Application\Restaurant.Application.csproj
34. Upgrade src\Services\Mechanical\Mechanical.Application\Mechanical.Application.csproj
35. Upgrade src\Services\Mechanical\Mechanical.Infrastructure\Mechanical.Infrastructure.csproj
36. Upgrade src\Services\Loyalty\Loyalty.Infrastructure\Loyalty.Infrastructure.csproj
37. Upgrade src\Services\Loyalty\Loyalty.Application\Loyalty.Application.csproj
38. Upgrade src\Services\Common\Common.Application\Common.Application.csproj
39. Upgrade src\Services\Common\Common.Infrastructure\Common.Infrastructure.csproj
40. Upgrade src\Services\BarberShop\BarberShop.Application\BarberShop.Application.csproj
41. Upgrade src\Services\BarberShop\BarberShop.Infrastructure\BarberShop.Infrastructure.csproj
42. Upgrade src\Services\Purchases\Purchases.API\Purchases.API.csproj
43. Upgrade src\ApiGateways\Ocelot.API\Ocelot.API.csproj
44. Upgrade src\Services\Billing\Billing.API\Billing.API.csproj
45. Upgrade src\Services\Sales\Sales.API\Sales.API.csproj
46. Upgrade src\Services\Inventory\Inventory.API\Inventory.API.csproj
47. Upgrade src\Services\Configuration\Configuration.API\Configuration.API.csproj
48. Upgrade src\Services\Accounting\Accounting.API\Accounting.API.csproj
49. Upgrade src\WebApps\WebUI\WebUI.csproj
50. Upgrade src\Services\Vet\Vet.API\Vet.API.csproj
51. Upgrade src\Services\TechnicalSupport\TechnicalSupport.API\TechnicalSupport.API.csproj
52. Upgrade src\Services\Restaurant\Restaurant.API\Restaurant.API.csproj
53. Upgrade src\Services\Mechanical\Mechanical.API\Mechanical.API.csproj
54. Upgrade src\Services\Loyalty\Loyalty.API\Loyalty.API.csproj
55. Upgrade src\Services\Identity\Identity.API\Identity.API.csproj
56. Upgrade src\Services\Common\Common.API\Common.API.csproj
57. Upgrade src\Services\BarberShop\BarberShop.API\BarberShop.API.csproj

## Settings

This section contains settings and data used by execution steps.

### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                                      | Current Version | New Version | Description                                   |
|:--------------------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 9.0.10          | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation | 9.0.10          | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.AspNetCore.OpenApi                      | 9.0.10          | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.EntityFrameworkCore.Design              | 9.0.10          | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.EntityFrameworkCore.Tools               | 9.0.10          | 10.0.0      | Recommended for .NET 10.0                     |
| Microsoft.VisualStudio.Azure.Containers.Tools.Targets | 1.22.1     |             | No supported version found for .NET 10.0      |

### Project upgrade details
This section contains details about each project upgrade and modifications that need to be done in the project.

#### Purchases.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Billing.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Sales.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Inventory.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Configuration.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Accounting.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Vet.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### TechnicalSupport.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Restaurant.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Mechanical.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Loyalty.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Common.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### BarberShop.Domain modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Purchases.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Purchases.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Billing.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Billing.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Sales.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Sales.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Inventory.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Inventory.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Configuration.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Configuration.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Accounting.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Accounting.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Vet.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Vet.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### TechnicalSupport.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### TechnicalSupport.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Restaurant.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Restaurant.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Mechanical.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Mechanical.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Loyalty.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Loyalty.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Common.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Common.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### BarberShop.Application modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### BarberShop.Infrastructure modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

#### Purchases.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Ocelot.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)

#### Billing.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Sales.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Inventory.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Configuration.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Accounting.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### WebUI modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Vet.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### TechnicalSupport.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Restaurant.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Mechanical.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Loyalty.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Identity.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.Identity.EntityFrameworkCore should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### Common.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)

#### BarberShop.API modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.VisualStudio.Azure.Containers.Tools.Targets currently at version `1.22.1` has no supported version for .NET 10.0 (*package needs to be removed or replaced*)
  - Microsoft.AspNetCore.OpenApi should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Design should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
  - Microsoft.EntityFrameworkCore.Tools should be updated from `9.0.10` to `10.0.0` (*recommended for .NET 10.0*)
