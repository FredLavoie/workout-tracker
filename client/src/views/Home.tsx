import React from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../services/authentication";

export function Home(): JSX.Element {
    if (isAuthenticated() === true) {
        return <Redirect to="/dashboard" />;
    }
    return <Redirect to="/login" />;
}
