
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea, Grid, Tooltip } from '@mui/material';
import brand_img from '/assets/images/imgProductDefault.png';

import { ItemReadDto, Measure, ProductPVPReadDto } from '@/core/models';
import { useSaleStore } from '@/stores/saleStore';
import { productService } from '@/core/services';
import { useLoaderStore } from '@/stores';
import { PricingCalculateUtility, RoundNumber } from '@/core/utilities';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';  

type ItemCardProps = {
    item: ItemReadDto
}


export default function ItemCard({ item }: ItemCardProps) {
    const { addItemToCart, getItemQty } = useSaleStore(state => ({
        addItemToCart: state.addItemToCart,
        getItemQty: state.getItemQty
    }))
    const { items, dataForm } = useSaleStore(state => ({
        items: state.items,
        dataForm: state.dataForm,
    }))
    const itemSearch = useSaleStore(state => state.itemSearch)
    const order = useSaleStore(state => state.order)
    // const [warehouses, setWarehouses] = useState<Array<WarehouseAsign>>([]) 

    const { showLoader } = useLoaderStore();


    const handleSelectItem = (item: ItemReadDto) => {
        console.log(item)
        const decimal = dataForm.decimal;
        // const warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig);

        // let dataWarehouse = {} as WarehouseAsign;
        // if (warehouses.length > 0) {
        //     dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
        // } else {
        //     SnackbarUtility.warning('No tienes bodegas asignadas')
        //     return
        // }

        showLoader(true)
        // if (itemSearch.code === "COM") {
        //     console.log('test')
        //     MenuItemService.get(item.itemId).then(response => {
        //         console.log(response)
        //     }).finally(() => showLoader(false))
        //     return
        // }


        productService.findForSale(item.productId, order.bodegaId).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(measure => measure.measureId === product.measureId) as Measure;

            const taxRateData = dataForm.taxRates.find(item => item.taxRateCode === product.taxRateCode); // Tarifa Impuesto 
            const taxData = dataForm.taxes.find(tax => tax.code === taxRateData?.taxCode); // Impuesto IVA-ICE 
            const taxId = taxData?.taxId ?? 0

            const taxPercentId = taxRateData?.taxRateId ?? 0;



            if (!product.carryInventory) {
                addItem();
                return
            }

            productService.checkNotificationStock({
                idArticulo: product.productId,
                cantidad: getItemQty(item.productId),
                idBodega: order.bodegaId
            }).then(async response => {
                const { code, message, titleSms } = response;
                if (code === "1") {
                    addItem();
                    return
                }

                const { isConfirmed } = await Swal.fire({
                    title: `<small>${titleSms}</small>`,
                    icon: 'warning',
                    html: `<small>${message}</small>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })

                if (isConfirmed) {
                    if (code === "2") {
                        addItem();
                    }
                }
            })



            function addItem() {
                const uuid = uuidv4();
                const { salePrice, priceWithVat, feeId } = measureData.pvps[0] as ProductPVPReadDto
                const taxValue = PricingCalculateUtility.calculateTaxValue(salePrice, taxRateData?.percentage ?? 0)

                addItemToCart({
                    orderId: 0,
                    id: 0,
                    index: item.index,
                    productId: product.productId,
                    code: product.productCode,
                    itemId: item.itemId,
                    menuId: item.menuId,
                    feeId: feeId ?? 0,
                    taxId: taxId,
                    taxPercentId: taxPercentId,
                    taxValue: PricingCalculateUtility.calculateTaxValue(salePrice, taxRateData?.percentage ?? 0),
                    description: product.description,
                    quantity: 1,
                    cost: product.costPrice, //Precio Costo
                    price: RoundNumber(salePrice ?? 0, decimal.nroPrecio), //Precio Unitario - Precio Venta
                    priceWithVat: RoundNumber(priceWithVat, decimal.nroPrecio),
                    discount: 0,
                    discountTotal: 0,
                    total: salePrice ?? 0,
                    s3ObjectUrl: product.s3ObjectUrl ? product.s3ObjectUrl : brand_img,
                    carryInventory: product.carryInventory,
                    bodegaId: order.bodegaId,
                    taxes: [{
                        uuid: uuid,
                        taxId: taxId,
                        taxPercentId: taxPercentId,
                        taxBase: salePrice ?? 0,
                        taxValue: taxValue,
                    }],
                    pvps: measureData.pvps,
                    uuid: uuid,
                    obs: "",
                    itemTypeCode: item.itemTypeCode,
                    envioSri: false
                })
            }

        }).finally(() => showLoader(false))

    }

    return (
        <Card sx={
            {
                display: 'flex',
                flexDirection: 'column',
                height: '190px',
                //maxHeight: "200px",
                borderRadius: "16px",
                borderColor: items.some(cartItem => cartItem.index === item.index) ? '#6571ff !important' : '',

                border: items.some(cartItem => cartItem.index === item.index) ? '1px solid' : '',
            }
        }>
            <CardActionArea onClick={() => handleSelectItem(item)}>
                <Tooltip title="Stock">
                    <Badge
                        badgeContent={item.stock.toString()}
                        color={item.stock > 0 ? 'success' : 'error'}
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        style={{ position: 'absolute', top: '20px', left: '20px' }}
                    />
                </Tooltip>


                <CardMedia
                    component="img"
                    height="120"
                    image={item.s3ObjectUrl ? item.s3ObjectUrl : brand_img}
                    alt="green iguana"
                /> 

                <CardContent>

                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography gutterBottom color="text.secondary" variant="caption" component="div">
                                {item.code}
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="body1" component="div">
                                ${RoundNumber(item.pvps.priceWithVat, 2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" component="div" noWrap>
                                {item.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

            </CardActionArea>
        </Card>
    );
}
