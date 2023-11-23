
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, Box, CardActionArea, Divider } from '@mui/material';
import brand_img from '/assets/images/imgProductDefault.png';

import { ItemReadDto, Measure, ProductPVPReadDto } from '@/core/models';
import { useSaleStore } from '@/stores/saleStore';
import { productService } from '@/core/services';
import { PricingCalculateUtility, RoundNumber } from '@/core/utilities';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { showLoader, hideLoader } from "@/spinner";
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
    const order = useSaleStore(state => state.order)
    // const [warehouses, setWarehouses] = useState<Array<WarehouseAsign>>([]) 

    // const { showLoader } = useLoaderStore();


    const handleSelectItem = (item: ItemReadDto) => {
        
        showLoader();
        const decimal = dataForm.decimal;
        // const warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig);

        // let dataWarehouse = {} as WarehouseAsign;
        // if (warehouses.length > 0) {
        //     dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
        // } else {
        //     SnackbarUtility.warning('No tienes bodegas asignadas')
        //     return
        // }

        // showLoader(true)
        // if (itemSearch.code === "COM") {
        //     console.log('test')
        //     MenuItemService.get(item.itemId).then(response => {
        //         console.log(response)
        //     }).finally(() => showLoader(false))
        //     return
        // }


        productService.findForSale(item.productId, order.bodegaId).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(medida => (medida.defaultMedida));
           // const measureData = measures.find(measure => measure.measureId === product.measureId) as Measure;

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
                let salePrice = 0, priceWithVat = 0, feeId = 0; 
                if(measureData){
                    const dataPVP = measureData.pvps.find(pvp=>(pvp.default));
                    if(dataPVP){
                        salePrice = dataPVP.salePrice;
                        priceWithVat = dataPVP.priceWithVat;
                        feeId = dataPVP.feeId

                    }
                } 
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
                    summary: item.summary,
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
                    measureId: measureData ? measureData.measureId : 0,
                    measures: measures,
                    pvps: measureData ? measureData.pvps : [],
                    uuid: uuid,
                    obs: "",
                    itemTypeCode: item.itemTypeCode,
                    envioSri: false,
                    paid: false
                })
            }

        }).finally(() => hideLoader())

    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };


    return (
        <Box height={200}>
            <Card sx={{
                maxWidth: 200,
               
                '&:hover': {
                    transform: 'scale(1.05)',
                },
                borderRadius: "16px",
                borderColor: items.some(cartItem => cartItem.productId === item.productId) ? '#6571ff !important' : '',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: items.some(cartItem => cartItem.productId === item.productId) ? '1px solid' : '',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'stretch',
            }}>
                <HtmlTooltip followCursor  title={
                    item.summary && item.summary.split(',').map((ss, i) => {
                        return (
                            <Box key={i}>
                                <Typography variant="caption" gutterBottom>
                                    {ss}
                                </Typography>
                                <Divider />
                            </Box>
                        )
                    })
                }>
                    <CardActionArea onClick={() => handleSelectItem(item)}>

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
                        <CardMedia sx={{
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                        }} component="img" height="120" image={item.s3ObjectUrl ? item.s3ObjectUrl : brand_img} />
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h5" sx={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    width: '75%',
                                }}>
                                    {truncateText(item.description, 60)}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',  // Centra el contenido horizontalmente
                                    justifyContent: 'center',  // Centra el contenido verticalmente
                                    
                                }}>
                                    <Typography variant="subtitle2" sx={{
                                        
                                        fontWeight: 'bold',
                                        color: 'red',  // Cambia el color del texto a blanco o el color que desees
                                    }}>
                                        ${RoundNumber(item.pvps.priceWithVat, 2)}
                                    </Typography>
                                </Box>
                            </Box> 
                        </CardContent>
                        {/* <Box margin={0.6}>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                            }}>
                                {truncateText(item.description, 50)}
                            </span>
                        </Box>
                        <Box sx={{ display: 'flex', color: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor: 'primary.dark' }}>
                            <Typography variant="body1" gutterBottom>
                                $ {RoundNumber(item.pvps.priceWithVat, 2)}
                            </Typography>
                        </Box> */}
                    </CardActionArea>
                </HtmlTooltip>
            </Card>
        </Box> 
    );
}
