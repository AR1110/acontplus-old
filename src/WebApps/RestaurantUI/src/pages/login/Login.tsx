import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { json, useNavigate } from 'react-router-dom';
import { PrivateRoutes } from "@/core/models";
import background from '/assets/images/background/background.jpeg';
import { SnackbarUtility } from '@/core/utilities';
import { authService, setEstabs, setToken, setUserData } from '@/core/services';
import { hideLoader, showLoader } from '@/spinner';
import EstabsDialog from './EstabsDialog';
import Copyright from './Copyright';
import { useState } from 'react';


const LoginPage = () => {
  //Dialog Estab
  const [estabDialogParams, setEstabDialogParms] = useState<any>("")
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);

  const handleClose = (value: []) => {
    setOpen(false);
    setSelectedValue(value);
  };
  const navigate = useNavigate();


  const validationSchema = yup.object({
    username: yup.string().trim("Usuario es requerido").required('Usuario es requerido'),
    password: yup
      .string().trim("Contraseña es requerido").required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      showLoader();
      const agent = navigator.userAgent;
      authService.login(values.username, values.password, JSON.stringify({ application: "Restaurant", browser: agent })).then(response => {

        if (response.code === "0" || response.id === "0") {
          SnackbarUtility.warning(response.message);
        }
        if (response.code === "1") {
          const userRoles = JSON.parse(response.payload);
          const establecimientos = userRoles.flatMap((userRole: any) => userRole.establecimientos)

          if (establecimientos.length > 1) {
            setEstabDialogParms(userRoles)
            setOpen(true);
          } else {
            SnackbarUtility.success("Inciando Sessión");
            const dataLogin = userRoles[0];

            setToken(dataLogin.token)
            setUserData(dataLogin);
            setEstabs(dataLogin.establecimientos);
            navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
          }
        }
      }).finally(() => {
        hideLoader();
      })
    }
  });

  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>

          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Inicio de Sesión
            </Typography>
            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                autoComplete="password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                size='large'
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ingresar
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>

        </Grid>
      </Grid>

      {
        open && <EstabsDialog
          params={estabDialogParams}
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
      }

    </>
  );
}

export default LoginPage;