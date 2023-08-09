import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { AuthService as AuthSvc } from "@/core/services/auth.service";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/user.slice";
import { useNavigate } from 'react-router-dom';
import { DataLogin, PrivateRoutes } from "@/core/models";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        AcontPlus
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    username: yup.string().trim("Usuario es requerido").required('Usuario es requerido'),
    password: yup
      .string().trim("Contraseña es requerido").required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: 'edinson.romero',
      password: 'edi12345',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values)
      AuthSvc.login(values.username, values.password).then(response => {
        console.log(response)
        if (response.code === "0") {
          // tS.warning(response.message);
          return;
        }
        if (response.code === "1") {
          // tS.success(response.message);

          const userData = response.payload as DataLogin;

          const jwtToken = userData.userData[0]?.jwtToken;

          AuthSvc.setPersistent("ACCESS_TOKEN", jwtToken!);
          AuthSvc.setPersistent("USER", JSON.stringify(userData));
          dispatch(setCredentials(userData));
          navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
        }
      })
    }
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
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
              autoComplete="current-password"
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
  );
}