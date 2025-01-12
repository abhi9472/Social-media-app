import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import Home from "./Pages/Home.jsx";
// import HomeDetail from './Pages/HomeDetail.jsx';
import App from "./App.jsx";
// import AllPg from './Pages/AllPg.jsx';
// import "./App.css";
// import "./global.css";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
// import ForgotPassword from './Pages/ForgotPassword.jsx';
// import AdminProfile from './Pages/Profile.jsx';
// import AddHome from './Pages/AddHome.jsx';
// import VerifyOtp from './Pages/Verifyotp.jsx';
// import Setpassword from './Pages/Setpassword.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<App />}>
      {/* <Route path="" element={<Home />} /> */}
      {/* <Route path="/homes/:id" element={<HomeDetail />} /> */}
      {/* <Route path="/allpg" element={<AllPg/>} /> */}
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      {/* <Route path="/profile" element={<AdminProfile/>} /> */}
      {/* <Route path="/AddHome" element={<AddHome/>} /> */}
      {/* <Route path="/Verifyotp" element={<VerifyOtp/>}/> */}
      {/* <Route path="/setpassword" element={<Setpassword/>}/> */}

      {/* <Route path="/forgotpassword" element={<ForgotPassword/>} /> */}

      {/* <Route path="/logout" element={</>} /> */}      
    </Route>,

  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
