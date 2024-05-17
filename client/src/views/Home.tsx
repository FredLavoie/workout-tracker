import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authentication";

export function Home() {
    const location = useLocation();
    if (isAuthenticated() === true) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}
