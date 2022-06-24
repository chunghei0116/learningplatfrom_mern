import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const ProfileComponent = () => {
  let [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser()); //get the exist user in localstorage
  }, []);
  return <div style={{ padding: "3rem" }}></div>;
};
