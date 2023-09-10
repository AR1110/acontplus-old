 
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import notFound_img from '/assets/images/background/error404.jpg'; 
 function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">
              404
            </Typography>
            <Typography variant="h6">
            La página que buscas no existe.
            </Typography>
            <Button variant="contained">Back Home</Button>
          </Grid>
          <Grid item xs={6}>
            <img
              src={notFound_img}
              alt=""
              width={500} height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default NotFound
