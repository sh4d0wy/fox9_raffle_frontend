import { Link, useLocation } from "@tanstack/react-router";
import { useNavbarStore } from "../../../store/globalStore";
import SettingsModel from "./SettingsModel";
import NotificationsModel from "./NotificationsModel";
import DynamicNewLink from "./DynamicNewLink";
import StatsDropdown from "./StatsDropdown";

export const Navbar = () => {

  const {
    isAuth,
    showSettingsModal,
    showNotificationModal,
    showMobileMenu,
    toggleMobileMenu,
    openSettings,
    closeSettings,
    openNotifications,
    closeNotifications,
  } = useNavbarStore();

  const location = useLocation();

  const navLinks = [
    { label: "Fox9", path: "/" },
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

            <Link
              to={"/"}
              className="h-11 lg:px-6 px-2  py-2.5 bg-linear-to-r from-black-1000 via-neutral-500 to-black-1000 rounded-full flex items-center gap-2.5 transition duration-300 hover:opacity-90"
            >
              {isAuth ? (
                <>
                  <img src="/icons/fox-icon.svg" className="size-7 hidden lg:block" />
                  <img src="/icons/wallet_icon.svg" className="size-7 block lg:hidden" />
                  <span className="text-white hidden lg:block text-base font-semibold font-inter">
                    He1v..J5zi
                  </span>
                </>
              ) : (
                <span className="text-white  text-base font-semibold font-inter">
                  Select Wallet
                </span>
              )}
            </Link>

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
          <Link
            to={"/"}
            className="h-11 px-6 py-2.5 group bg-linear-to-r hover:from-primary-color hover:via-primary-color hover:to-primary-color from-black-1000 via-neutral-500 to-black-1000 rounded-full flex items-center gap-2.5 transition duration-300 hover:opacity-90"
          >
            {isAuth ? (
              <>
                <img src="/icons/fox-icon.svg" className="size-7" />
                <span className="text-white group-hover:text-black-1000 text-base font-semibold font-inter">
                  He1v..J5zi
                </span>
              </>
            ) : (
              <span className="text-white text-base font-semibold font-inter">
                Select Wallet
              </span>
            )}
          </Link>

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
