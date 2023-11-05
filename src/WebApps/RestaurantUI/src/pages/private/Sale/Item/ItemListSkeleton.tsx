
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box'; 
import Skeleton from '@mui/material/Skeleton';
 
export default function ItemListSkeleton() { 
  return (
    <Grid container wrap="nowrap">
      {Array.from(new Array(4)).map((_, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5}}>
            <Skeleton variant="rectangular"   height={118} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>           
        </Box>
      ))}
    </Grid>
  );
}
 