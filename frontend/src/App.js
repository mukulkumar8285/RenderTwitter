import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

function App() {
    const location = useLocation();
	const navigate = useNavigate();
    const [showSidebarAndRightPanel, setShowSidebarAndRightPanel] = useState(true);

    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await fetch("http://localhost:8080/api/auth/me", {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        // Determine if Sidebar and RightPanel should be shown
        const publicPaths = ["/signup", "/login"];
        setShowSidebarAndRightPanel(!publicPaths.includes(location.pathname));
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }
	const isCookiePresent = Cookies.get('yourCookieName') !== undefined;
	console.log(isCookiePresent);

    return (
        <div className='flex max-w-6xl mx-auto'>
            {showSidebarAndRightPanel && <Sidebar />}
            <Routes>
                <Route path='/' element={ <HomePage /> } />
                <Route path='/login' element={!isCookiePresent ? <LoginPage /> : <navigate to='/' />} />
                <Route path='/signup' element={!isCookiePresent ? <SignUpPage /> : <navigate to='/' />} />
                <Route path='/notifications' element={ <NotificationPage /> } />
                <Route path='/profile/:username' element={ <ProfilePage /> } />
            </Routes>
            {showSidebarAndRightPanel && <RightPanel />}
            <Toaster />
        </div>
    );
}

export default App;
