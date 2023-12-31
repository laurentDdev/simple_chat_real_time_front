import {Outlet, useLoaderData} from "react-router-dom";
import {useEffect} from "react";
import {getTokenDuration} from "../utils/auth.ts";

const RootLayout = () => {

    const token = useLoaderData()
    useEffect(() => {
        if (!token) {
            return;
        }

        if (token === 'EXPIRED') {
            localStorage.removeItem("token")
            localStorage.removeItem("expiration")
            localStorage.removeItem("userData")
            return;
        }

        const tokenDuration = getTokenDuration();
        console.log(tokenDuration);

        setTimeout(() => {
            localStorage.removeItem("token")
            localStorage.removeItem("expiration")
            localStorage.removeItem("userData")
        }, tokenDuration);
    }, [token]);

    return (
        <>
            <main>
                <Outlet/>
            </main>
        </>
    );
};

export default RootLayout;
