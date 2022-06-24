import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeComponet from "./components/home-component";
import NavComponent from "./components/nav-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";

function App() {
  return (
    <div>
      <NavComponent> </NavComponent>
      <Routes>
        <Route path="/" element={<HomeComponet />} exact></Route>
        <Route path="/register" element={<RegisterComponent />} exact></Route>
        <Route path="/login" element={<LoginComponent />} exact></Route>
      </Routes>
    </div>
  );
}

export default App;
