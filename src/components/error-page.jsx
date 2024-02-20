import { useRouteError } from "react-router-dom";
import React from "react";
export default function ErrorPage() {
    const { error } = useRouteError();
    console.log(error);
    return (
        <>
        <h1>Oops!</h1>
        <p>Something went wrong:</p>
        <pre>{error.statusText || error.message}</pre>
        </>
    );
    }