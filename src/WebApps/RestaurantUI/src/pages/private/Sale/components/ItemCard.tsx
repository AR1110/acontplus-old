
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Badge, CardActionArea, Grid, Tooltip } from '@mui/material';
import brand_img from '/assets/images/brand_logo.png';

import { ItemReadDto, Measure, WarehouseAsign } from '@/core/models';
import { useSaleStore } from '@/stores/saleStore';
import { ProductService } from '@/core/services';
import { useAuthStore } from '@/stores';
import { SnackbarUtility } from '@/core/utilities'; 
import Swal from 'sweetalert2';

type ItemCardProps = {
    item: ItemReadDto
}

// const customCard = {
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
//   borderRadius: "16px",
//   borderColor: '#6571ff !important',
//   border: '1px solid',
// }
// const cardContent = {
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   paddingLeft: "0.5rem!important",
//   paddingRight: "0.5rem!important",
//   paddingTop: "0.5rem!important",
//   paddingBottom: "0.25rem!important"
// }

// const flexRow = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// }

export default function ItemCard({ item }: ItemCardProps) {
    const { addItemToCart, getItemQty } = useSaleStore(state => ({ 
        addItemToCart: state.addItemToCart, 
        getItemQty: state.getItemQty 
    }))
    const { items, dataForm } = useSaleStore(state => ({
        items: state.items,
        dataForm: state.dataForm,
    }))
    const dataEstab = useAuthStore(state => state.dataEstab)
    // const [warehouses, setWarehouses] = useState<Array<WarehouseAsign>>([]) 
    const handleSelectItem = (item: ItemReadDto) => {
      
        const warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig);

        let dataWarehouse = {} as WarehouseAsign
        if (warehouses.length > 0) {
            dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
        } else {
            SnackbarUtility.warning('No tienes bodegas asignadas')
            return
        }

        ProductService.findForSale(item.productId, dataWarehouse.idBodega).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(measure => measure.measureId === product.measureId) as Measure;

            if (!product.takesInventory) {
                addItem();
            }

            ProductService.checkNotificationStock({
                idArticulo: product.productId,
                cantidad: getItemQty(item.productId) ,
                idBodega: dataWarehouse.idBodega
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
            console.log(item)
            console.log(product)
            console.log(measures)
            console.log(dataForm)
            const taxRateData = dataForm.taxRates.find(item=>item.taxRateCode===product.taxRateCode);
            const taxId = dataForm.taxes.find(tax => tax.code === taxRateData?.taxCode)?.taxId ?? 0
            const taxPercentId = taxRateData?.taxRateId ?? 0
            const taxValue = measureData.rates[0]?.priceWithVat ?? 0
            const uuid = crypto.randomUUID();

            function addItem() {
                addItemToCart({
                    index: 0,
                    productId: product.productId,
                    code: product.productCode,
                    itemId: item.itemId,
                    taxId: taxId,
                    taxPercentId: taxPercentId,
                    taxValue:taxValue,
                    description: product.description,
                    quantity: 1,
                    cost: 0,
                    price: measureData.rates[0]?.salePrice ?? 0,
                    discount: 0,
                    discountTotal: 0,
                    total: measureData.rates[0]?.salePrice ?? 0,
                    s3ObjectUrl: product.s3ObjectUrl ? product.s3ObjectUrl : brand_img,
                    takesInventory: product.takesInventory,
                    taxes: [{
                        uuid: uuid,
                        taxId: taxId,
                        taxPercentId: taxPercentId,
                        taxBase: 0,
                        taxValue: taxValue,                        
                    }],
                    uuid: uuid
                })
            }

        })

    }

    return (
        <Card sx={
            {
                display: 'flex',
                flexDirection: 'column',
                height: '200px',
                borderRadius: "16px",
                borderColor: items.some(cartItem => cartItem.productId === item.productId) ? '#6571ff !important' : '',

                border: items.some(cartItem => cartItem.productId === item.productId) ? '1px solid' : '',
            }
        }>
            <CardActionArea onClick={() => handleSelectItem(item)}>
                <Tooltip title="Stock">
                    <Badge
                        badgeContent={item.stock}
                        color='success'
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        style={{ position: 'absolute', margin: '20px' }}
                    />

                </Tooltip>
                <CardMedia
                    component="img"
                    height="120"
                    image={item.s3ObjectUrl ? item.s3ObjectUrl : brand_img}
                    alt="green iguana"
                />
                {/* <CardContent>
          <Typography variant="subtitle2" gutterBottom component="div">
            {item.description}
          </Typography>          
        </CardContent> */}
                <CardContent  >

                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle2" component="div">
                                {item.code}
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="body2" component="div">
                                <Badge color="primary" badgeContent={`$${0}`} />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography color="text.secondary" variant="caption">
                        {item.description}
                    </Typography>
                </CardContent>

            </CardActionArea>
        </Card>
    );
}
