src/
├── shared/
│   ├── domain/
│   │   ├── value-objects/
│   │   │   ├── Money.ts
│   │   │   ├── DateRange.ts
│   │   │   └── Percentage.ts
│   │   └── interfaces/
│   │       ├── IRepository.ts
│   │       └── IEntity.ts
│   └── infrastructure/
│       ├── persistence/
│       │   └── BaseRepository.ts
│       └── utils/
│           ├── date.util.ts
│           ├── decimal.util.ts
│           └── string.util.ts
│
├── modules/
│   ├── accounting/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── CashBox.ts
│   │   │   │   ├── Payment.ts
│   │   │   │   └── AccountingMovement.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── PaymentStatus.ts
│   │   │   │   └── PaymentType.ts
│   │   │   └── repositories/
│   │   │       ├── ICashBoxRepository.ts
│   │   │       └── IPaymentRepository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── payments/
│   │   │   │   │   ├── CreatePaymentUseCase.ts
│   │   │   │   │   └── ProcessPaymentUseCase.ts
│   │   │   │   └── cashbox/
│   │   │   │       ├── OpenCashBoxUseCase.ts
│   │   │   │       └── CloseCashBoxUseCase.ts
│   │   │   ├── ports/
│   │   │   │   ├── IEmailService.ts
│   │   │   │   └── IPrinterService.ts
│   │   │   └── dtos/
│   │   │       ├── PaymentDTO.ts
│   │   │       └── CashBoxDTO.ts
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── CashBoxRepository.ts
│   │   │   │   │   └── PaymentRepository.ts
│   │   │   │   └── mappers/
│   │   │   │       ├── CashBoxMapper.ts
│   │   │   │       └── PaymentMapper.ts
│   │   │   └── services/
│   │   │       ├── EmailServiceImpl.ts
│   │   │       └── PrinterServiceImpl.ts
│   │   └── presentation/
│   │       ├── controllers/
│   │       │   ├── PaymentController.ts
│   │       │   └── CashBoxController.ts
│   │       ├── components/
│   │       │   └── cashbox/
│   │       │       ├── CashBoxModal.ts
│   │       │       └── PaymentForm.ts
│   │       └── pages/
│   │           ├── CashBoxPage.ts
│   │           └── PaymentsPage.ts
│   │
│   ├── inventory/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Product.ts
│   │   │   │   ├── Stock.ts
│   │   │   │   └── Category.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Price.ts
│   │   │   │   └── Quantity.ts
│   │   │   └── repositories/
│   │   │       ├── IProductRepository.ts
│   │   │       └── IStockRepository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── CreateProductUseCase.ts
│   │   │   │   └── UpdateStockUseCase.ts
│   │   │   └── ports/
│   │   │       └── IImageStorage.ts
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── repositories/
│   │   │   │   │   └── ProductRepository.ts
│   │   │   │   └── mappers/
│   │   │   │       └── ProductMapper.ts
│   │   │   └── services/
│   │   │       └── ImageStorageImpl.ts
│   │   └── presentation/
│   │       ├── controllers/
│   │       │   └── ProductController.ts
│   │       ├── components/
│   │       │   └── product/
│   │       │       ├── ProductForm.ts
│   │       │       └── ProductList.ts
│   │       └── pages/
│   │           └── ProductPage.ts
│   │
│   └── billing/
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── Invoice.ts
│       │   │   └── CreditNote.ts
│       │   └── repositories/
│       │       └── IInvoiceRepository.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── CreateInvoiceUseCase.ts
│       │   │   └── GenerateCreditNoteUseCase.ts
│       │   └── ports/
│       │       └── ISriService.ts
│       ├── infrastructure/
│       │   ├── persistence/
│       │   │   └── InvoiceRepository.ts
│       │   └── services/
│       │       └── SriServiceImpl.ts
│       └── presentation/
│           ├── controllers/
│           │   └── InvoiceController.ts
│           └── pages/
│               └── InvoicePage.ts
│
└── core/
    ├── guards/
    │   └── AuthGuard.ts
    ├── interceptors/
    │   ├── ErrorInterceptor.ts
    │   └── LoaderInterceptor.ts
    └── services/
        ├── DialogService.ts
        └── ToasterService.ts
