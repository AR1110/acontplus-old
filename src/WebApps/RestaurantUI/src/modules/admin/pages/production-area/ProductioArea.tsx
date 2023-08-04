import BackdropLoader from "@/core/components/BackdropLoader";
import { ErrorBoundary } from "@/core/utils/ErrorBoundary";
import { useFetchAndLoad } from "@/hooks";

export default function ProductArea() {
  const { loading, callEndpoint } = useFetchAndLoad();
  
  return (
    <ErrorBoundary fallBackComponent={<>Error</>}>
      {
        loading ? <BackdropLoader open={loading}/> : <Grid></Grid>
      }
    </ErrorBoundary>
  );
}
