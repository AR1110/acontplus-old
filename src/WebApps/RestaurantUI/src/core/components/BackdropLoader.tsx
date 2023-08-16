import { Backdrop, CircularProgress, Theme } from "@mui/material"

 type Props = {
    open: boolean
 }
function BackdropLoader({open}: Props) {
  return (
    <Backdrop
    sx={{ color: '#fff', zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}
    open={open} 
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default BackdropLoader