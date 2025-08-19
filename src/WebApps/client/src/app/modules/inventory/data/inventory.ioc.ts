import {Provider} from "@angular/core";
import {BrandRepository} from "@inventory/domain/repositories/brand.repository";
import {BrandWebRepository} from "@inventory/data/brand/brand-web.repository";
import {FractionalProductRepository} from "@inventory/product/domain/repositories/fractional-product.repository";
import {FractionalProductRepositoryImpl} from "@inventory/product/infrastructure/fractional-product/fractional-product-repository-impl";
import {InventarioModeloRepository} from "@inventory/domain/repositories/inventario-modelo.repository";
import {InventarioModeloWebRepository} from "@inventory/data/inventario-modelo/inventario-modelo-web.repository";
import {MassiveTaxRepository} from "@inventory/domain/repositories/massive-tax.repository";
import {MassiveTaxWebRepository} from "@inventory/data/massive-tax/massive-tax-web.repository";
import {MeasureRepository} from "@inventory/domain/repositories/measure.repository";
import {MeasureWebRepository} from "@inventory/data/measure/measure-web.repository";
import {ProductRepository} from "@inventory/product/domain/repositories/product.repository";
import {ProductRepositoryImpl} from "@inventory/product/infrastructure/product/product-repository-impl";
import {ProductBarcodeRepository} from "@inventory/product/domain/repositories/product-barcode.repository";
import {ProductBarcodeRepositoryImpl} from "@inventory/product/infrastructure/product-barcode/product-barcode-repository-impl";
import {ProductPhotoRepository} from "@inventory/product/domain/repositories/product-photo.repository";
import {ProductPhotoRepositoryImpl} from "@inventory/product/infrastructure/product-photo/product-photo-repository-impl";
import {ProductUbicationRepository} from "@inventory/product/domain/repositories/product-ubication.repository";
import {ProductUbicationRepositoryImpl} from "@inventory/product/infrastructure/product-ubication/product-ubication-repository-impl";
import {TagRepository} from "@inventory/domain/repositories/tag.repository";
import {TagWebRepository} from "@inventory/data/tag/tag-web.repository";
import {TransferenciaBodegaRepository} from "@inventory/domain/repositories/transferencia-bodega.repository";
import {
  TransferenciaBodegaWebRepository
} from "@inventory/data/transferencia-bodega/transferencia-bodega-web.repository";
import {WarehouseRepository} from "@inventory/domain/repositories/warehouse.repository";
import {WarehouseRepositoryImpl} from "@inventory/data/warehouse/warehouse-repository.impl";
import {InventoryAdjustmentRepository} from "@inventory/inventory-adjustment/domain/inventory-adjustment.repository";
import {
  InventoryAdjustmentRepositoryImpl
} from "@inventory/inventory-adjustment/infrastructure/inventory-adjustment-repository.impl";


export const DATA_INVENTORY_IOC:Provider[]=[
  {
    provide: BrandRepository,
    useClass: BrandWebRepository,
  },
  {
    provide: FractionalProductRepository,
    useClass: FractionalProductRepositoryImpl,
  },
  {
    provide: InventarioModeloRepository,
    useClass: InventarioModeloWebRepository
  },
  {
    provide: MassiveTaxRepository,
    useClass: MassiveTaxWebRepository,
  },
  {
    provide: MeasureRepository,
    useClass: MeasureWebRepository,
  },
  {
    provide: ProductRepository,
    useClass: ProductRepositoryImpl
  },

  {
    provide: ProductBarcodeRepository,
    useClass: ProductBarcodeRepositoryImpl,
  },
  {
    provide: ProductPhotoRepository,
    useClass: ProductPhotoRepositoryImpl
  },
  {
    provide: ProductUbicationRepository,
    useClass: ProductUbicationRepositoryImpl,
  },
  {
    provide: TagRepository,
    useClass: TagWebRepository
  },
  {
    provide: TransferenciaBodegaRepository,
    useClass: TransferenciaBodegaWebRepository,
  },
  {
    provide: WarehouseRepository,
    useClass: WarehouseRepositoryImpl
  },
  {
    provide: InventoryAdjustmentRepository,
    useClass: InventoryAdjustmentRepositoryImpl,
  }

]
