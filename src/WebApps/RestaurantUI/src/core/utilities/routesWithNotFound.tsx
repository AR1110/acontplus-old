import { Routes, Route } from "react-router-dom";
import NotFound from "@/core/components/NotFound";
interface Props {
  children: JSX.Element[] | JSX.Element;
}

export default function RoutesWithNotFound({ children }: Props) {
  return (
    <Routes>
      {children}
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}
