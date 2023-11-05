 
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { darken, lighten, styled } from '@mui/material'; 
import { useCheckoutContext } from '../context';

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.main, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export default function City() {
    const {checkout, setPayment} = useCheckoutContext(); 
    const {dataForm} = checkout

    const cities = dataForm.cities;  
    const sortedCities = [...cities].sort((a, b) => a.province.localeCompare(b.province));
    return (
        <>
            {
                cities.length > 0 && (
                    <Autocomplete
                        fullWidth
                        id="grouped-city"
                        onChange={(_, newValue) => {
                            const cityId = newValue? newValue.cityId : 0                           
                            setPayment({ 
                                cityId 
                            })
                          }}
                        options={sortedCities}                        
                        groupBy={(option) => option.province}
                        getOptionLabel={(option) => option.description}
                        
                        renderInput={(params) => <TextField {...params} label="Ciudad" />}
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <GroupHeader>{params.group}</GroupHeader>
                                <GroupItems>{params.children}</GroupItems>
                            </li>
                        )}
                    />
                )
            }
        </>
    );
}
 