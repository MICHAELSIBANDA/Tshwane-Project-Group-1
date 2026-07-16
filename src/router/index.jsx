import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import DetailsCollection from "../pages/auth/DetailsCollection";
import Home from "../pages/user/Home";
import Payment from "../pages/user/Payment";
import PaymentResult from "../pages/user/PaymentResult";
import ChangePassword from "../pages/user/ChangePassword";
import TshwaneLayout from "../layouts/TshwaneLayout";

const router = createBrowserRouter([
  {
    element: <TshwaneLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/details", element: <DetailsCollection /> },
      { path: "/", element: <Home /> },
      { path: "/payment", element: <Payment /> },
      { path: "/payment/result", element: <PaymentResult /> },
      { path: "/change-password", element: <ChangePassword /> },
    ],
  },
]);

export default router;