import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider, PaletteMode } from "@mui/material";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Dashboard } from "./views/Dashboard";
import { Workout } from "./views/Workout";
import { Record } from "./views/Record";
import { DetailRecord } from "./views/DetailRecord";
import { Calendar } from "./views/Calendar";
import { Search } from "./views/Search";
import { Week } from "./views/Week";
import { Password } from "./views/PasswordChange";
import { NotFound } from "./views/NotFound";
import "./App.css";

export function App() {
    const [userTheme, setUserTheme] = useState(localStorage.getItem("userTheme") ?? "light");

    const myTheme = createTheme({
        palette: {
            mode: userTheme as PaletteMode,
            primary: {
                main: "#673ab7",
            },
            secondary: {
                main: "#1de9b6",
            },
        },
    });

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={myTheme}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Layout userTheme={userTheme} setUserTheme={setUserTheme}>
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                                <PrivateRoute path="/workouts" component={Workout} />
                                <PrivateRoute exact path="/records/event/:event" component={DetailRecord} />
                                <PrivateRoute exact path="/records/:id" component={Record} />
                                <PrivateRoute exact path="/cal/:date" component={Calendar} />
                                <PrivateRoute exact path="/search" component={Search} />
                                <PrivateRoute exact path="/password-change" component={Password} />
                                <PrivateRoute path="/week" component={Week} />
                                <Route exact path="/404" component={NotFound} />
                                <Route component={NotFound} />
                            </Switch>
                        </Layout>
                    </Switch>
                </Router>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
