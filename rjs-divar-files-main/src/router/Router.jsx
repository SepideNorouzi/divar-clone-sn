import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import HomePage from "pages/HomePage";
import AuthPage from "pages/AuthPage";
import DashboardPage from "pages/DashboardPage";
import PageNotFound from "pages/404";
import AdminPage from "pages/AdminPage";
import Loader from "components/modules/Loader";
import { getProfile } from "services/user";
import { getCookie } from "utils/cookie";

function Router() {
  const accessToken = getCookie("accessToken");
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    // 3. This is the fix: only run the query if the token exists
    // enabled: !!accessToken,
  });
  // The benefit, as your comment notes, is that React Query saves this data.
  //  If another component needs the user's profile, it can get it from the
  //  cache instantly instead of asking the server again.
  // console.log({ data, isLoading });

  if (isLoading) return <Loader />;

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route
        path="/dashboard"
        element={data ? <DashboardPage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={data ? <Navigate to="/dashboard" /> : <AuthPage />}
      />
      <Route
        path="/admin"
        element={
          data && data.data.role === "ADMIN" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
