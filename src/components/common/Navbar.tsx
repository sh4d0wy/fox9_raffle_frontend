import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNotificationQuery } from "../../../hooks/useNotificationQuery";
import { useEndedRafflesNotificationQuery } from "hooks/raffle/useEndedRafflesNotificationQuery";
import { useNavbarStore } from "../../../store/globalStore";
import { requestMessage, verifyMessage } from "../../../api/routes/userRoutes";
import SettingsModel from "./SettingsModel";
import NotificationsModel from "./NotificationsModel";
import DynamicNewLink from "./DynamicNewLink";
import StatsDropdown from "./StatsDropdown";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { isTokenExpired, setToken, removeToken } from "../../utils/auth";
import { toast } from "sonner";
import Toast from "./Toast";
import EndedRaffleToast from "./EndedRaffleToast";
import { invalidateQueries } from "../../utils/invalidateQueries";
import { useQueryClient } from "@tanstack/react-query";

export const Navbar = () => {

  const {
    isAuth,
    walletAddress,
    showSettingsModal,
    showNotificationModal,
    showMobileMenu,
    toggleMobileMenu,
    openSettings,
    closeSettings,
    openNotifications,
    closeNotifications,
    setAuth
  } = useNavbarStore();

  const { publicKey, connected, signMessage } = useWallet();
  const location = useLocation();
  const tokenCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAuthenticatingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const lastNotifiedWalletRef = useRef<string | null>(null);
  const hasShownNotificationsRef = useRef(false);
  const hasShownEndedRafflesNotificationsRef = useRef(false);
  const queryClient = useQueryClient();

  const signAndVerifyMessage = async (message: string) => {
    if (!publicKey || !signMessage) {
        throw new Error("Wallet not connected");
    }
    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const data = await verifyMessage(publicKey.toBase58(), message, bs58.encode(signature));
      
      if(!data.error && data.token){
        setToken(data.token.toString());
        invalidateQueries(queryClient, publicKey?.toBase58() ?? "");

        return { data, success: true };
      }
      return { data, success: false };
    } catch (error) {
      console.error("Error signing and verifying message:", error);
      return { data: null, success: false };
    }
  };

  const authenticateWallet = async (currentWalletKey: string, reason: string) => {
    if (isAuthenticatingRef.current) {
      return;
    }

    try {
      isAuthenticatingRef.current = true;
      
      const message = await requestMessage(currentWalletKey);
      const result = await signAndVerifyMessage(message.message);
      
      if (result.success && result.data?.token) {
        setToken(result.data.token.toString());
        setAuth(true, currentWalletKey);
        hasInitializedRef.current = true;
      } else {
        removeToken();
        setAuth(false, null);
        hasInitializedRef.current = false;
      }
    } catch (error) {
      removeToken();
      setAuth(false, null);
      hasInitializedRef.current = false;
    } finally {
      isAuthenticatingRef.current = false;
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      if (connected && publicKey) {
        const currentWalletKey = publicKey.toBase58();
        
        if (hasInitializedRef.current && isAuth && walletAddress === currentWalletKey) {
          return;
        }

        // Skip if authentication is in progress
        if (isAuthenticatingRef.current) {
          return;
        }

        const authToken = localStorage.getItem('authToken');
        
        if (authToken && !isTokenExpired(authToken)) {
          setAuth(true, currentWalletKey);
          hasInitializedRef.current = true;
        } else {
          await authenticateWallet(currentWalletKey, "initial connection");
        }
      } else if (!connected) {
        if (hasInitializedRef.current) {
          hasInitializedRef.current = false;
          isAuthenticatingRef.current = false;
          removeToken();
          setAuth(false, null);
        }
      }
    };
    fetchMessage();
  }, [connected, publicKey]);

  useEffect(() => {
    if (!connected || !publicKey || !hasInitializedRef.current) {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
        tokenCheckIntervalRef.current = null;
      }
      return;
    }

    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }

    tokenCheckIntervalRef.current = setInterval(() => {
      const authToken = localStorage.getItem('authToken');
      
      if (isTokenExpired(authToken) && publicKey) {
        console.log("Token check: Token expired, renewing...");
        authenticateWallet(publicKey.toBase58(), "token renewal");
      }
    }, 60 * 1000);

    return () => {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
        tokenCheckIntervalRef.current = null;
      }
    };
  }, [connected, publicKey, isAuth]);

  const shortAddress =
    walletAddress && `${walletAddress.slice(0, 4)}..${walletAddress.slice(-4)}`;

  const { data: notifications } =  useNotificationQuery();
  const { data: endedRafflesNotifications } = useEndedRafflesNotificationQuery();
  useEffect(() => {
    if (!publicKey || !notifications?.raffles) {
      return;
    }
    console.log("checking for wallet change")
    const walletChanged = lastNotifiedWalletRef.current !== publicKey.toBase58();
    
    if (walletChanged) {
      console.log("wallet changed");
      hasShownNotificationsRef.current = false;
      hasShownEndedRafflesNotificationsRef.current = false;
      lastNotifiedWalletRef.current = publicKey.toBase58();
    }

    if (hasShownNotificationsRef.current) {
      console.log("notifications already shown");
      return;
    }

    const unclaimedWinnings = notifications.raffles.filter(
      (raffle: { id: number; claimed: boolean }) => !raffle.claimed
    );

    if (unclaimedWinnings.length > 0) {
      console.log("showing notifications");
      hasShownNotificationsRef.current = true;

      unclaimedWinnings.forEach(
        (raffle: { id: number; claimed: boolean }, index: number) => {
          setTimeout(() => {
            toast.custom(
              (toastId) => (
                <Toast id={raffle.id} claimed={raffle.claimed} toastId={toastId as string} />
              ),
              {
                duration: 3000,
              }
            );
          }, index * 400);
        }
      );
    }
  }, [publicKey, notifications]);

  useEffect(() => {
    if (!publicKey || !endedRafflesNotifications?.raffles) {
      return;
    }

    if (hasShownEndedRafflesNotificationsRef.current) {
      return;
    }

    const endedRaffles = endedRafflesNotifications.raffles.filter(
      (raffle: { id: number; ticketAmountClaimedByCreator: boolean }) => !raffle.ticketAmountClaimedByCreator
    );

    if (endedRaffles.length > 0) {
      hasShownEndedRafflesNotificationsRef.current = true;

      endedRaffles.forEach(
        (raffle: { id: number; totalEntries: number }, index: number) => {
          setTimeout(() => {
            toast.custom(
              (toastId) => (
                <EndedRaffleToast id={raffle.id} totalEntries={raffle.totalEntries} toastId={toastId as string} />
              ),
              {
                duration: 3000,
              }
            );
          }, index * 400);
        }
      );
    }
  }, [publicKey, endedRafflesNotifications]);


  const navLinks = [
    { label: "Raffles", path: "/" },
    { label: "Auctions", path: "/auctions" },
    { label: "Gumballs", path: "/gumballs" },
  ];


  const isActive = (linkPath: string) => {
    if (linkPath === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/raffles');
    }
    return location.pathname.startsWith(linkPath);
  };



  return (
    <header className="w-full flex  py-8  xl:px-[52px] px-6 absolute z-40 ">
      <nav className="w-full lg:h-[72px] bg-black-1200 backdrop-blur-[132px] py-2 rounded-[56px] h-20 border border-yellow-1000/[70%] max-w-[1420px] mx-auto px-4 lg:px-[14px] flex justify-between items-center">
        <div className="flex  items-center lg:justify-start justify-between gap-4 xl:gap-12 w-full  flex-1">
          <Link to="/" className="inline-flex">
            <img
              className=" object-contain"
              src="/fox-logo.svg"
            />
          </Link>
          <div className="flex items-center lg:hidden gap-3">
            <div className="lg:block hidden">
            <DynamicNewLink isAuth={true} />
            </div>

            <WalletMultiButton className="inline-flex cursor-pointer w-11 h-11 transition duration-300 hover:opacity-90 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5" />

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex w-10 h-10  bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center"
            >
              <img src="/icons/menu_icon.svg" className="w-6" />
            </button>

          </div>

          <ul
            className={`${showMobileMenu ? "flex" : "hidden"
              } lg:flex lg:flex-row flex-col lg:shadow-none shadow-2xl lg:max-w-[456px] lg:items-center xl:gap-5 gap-2 lg:static absolute top-20 md:top-[90px] p-[5px] left-0 lg:w-fit w-full  lg:bg-white/[15%] bg-black-1000 rounded-[40px] backdrop-blur-[174px]`}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={`justify-center xl:min-w-24 px-3 flex items-center h-[31px] transition duration-500 text-sm md:text-base font-normal font-inter rounded-full ${isActive(link.path) ? 'text-black-1200 bg-primary-color font-semibold' : 'text-gray-1200 hover:text-primary-color'
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="text-center">
              <StatsDropdown />
            </li>

            <ul className="lg:hidden flex items-center lg:justify-start justify-center lg:pb-0 pb-6 gap-2 mt-4">
              {isAuth && (
                <li>
                  <Link
                    to={"/profile"}
                    className="inline-flex w-11 h-11 [&.active]:from-primary-color [&.active]:to-primary-color [&.active]:via-primary-color  bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5 transition duration-300"
                  >
                    <img src="/icons/user-icon.svg" className="w-5 lg:w-6" />
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={openSettings}
                  className="inline-flex cursor-pointer w-11 h-11 transition duration-300 hover:opacity-90 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5"
                >
                  <img src="/icons/settings-icon.svg" className="w-5" />
                </button>
              </li>
              <li>
                <button
                  onClick={openNotifications}
                  className="inline-flex w-11 h-11 transition duration-300 hover:opacity-90 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5"
                >
                  <img src="/icons/bell-icon.svg" className="w-5" />
                </button>
              </li>
            </ul>
          </ul>
        </div>

        <div className="hidden lg:flex items-center xl:gap-3 gap-2">
          <DynamicNewLink isAuth={true} />
          <WalletMultiButton className="inline-flex cursor-pointer w-11 h-11 transition duration-300 hover:opacity-90 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5" />

          {isAuth && (
            <Link
              to={"/profile"}
              className="inline-flex w-11 h-11 [&.active]:from-primary-color [&.active]:to-primary-color [&.active]:via-primary-color bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color  rounded-full justify-center items-center gap-2.5 transition duration-300"
            >
              <img src="/icons/user-icon.svg" className="w-6 rounded-full" />
            </Link>
          )}

          <button
            onClick={openSettings}
            className="inline-flex cursor-pointer w-11 h-11 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5 transition duration-300 hover:opacity-90"
          >
            <img src="/icons/settings-icon.svg" className="w-6 rounded-full" />
          </button>
          <button
            onClick={openNotifications}
            className="inline-flex cursor-pointer w-11 h-11 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full justify-center items-center gap-2.5 transition duration-300 hover:opacity-90"
          >
            <img src="/icons/bell-icon.svg" className="w-6 rounded-full" />
          </button>
        </div>
      </nav>

      {/* MODALS */}
      <SettingsModel isOpen={showSettingsModal} onClose={closeSettings} />
      <NotificationsModel isOpen={showNotificationModal} onClose={closeNotifications} />
    </header>
  );
};
