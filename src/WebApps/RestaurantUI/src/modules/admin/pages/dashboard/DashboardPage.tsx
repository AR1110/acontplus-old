import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export default function DashboardPage() {
  return (
    <div>
      <Grid container spacing={0} sx={{ mt: 2, mb: 2 }}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          ></Paper>
        </Grid>
      </Grid>
    </div>
  );
}
