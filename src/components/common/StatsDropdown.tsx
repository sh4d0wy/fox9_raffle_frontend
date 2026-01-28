import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link, useLocation } from '@tanstack/react-router';

function StatsDropdown() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <li className="text-center">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          className={`transition cursor-pointer duration-500 text-base md:text-base font-normal xl:min-w-24 px-3 font-inter ${location.pathname.startsWith('/stats')
            ? 'text-primary-color'
            : 'text-gray-1200 hover:text-primary-color'
            }`}
        >
          Stats
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Menu.Items className="absolute overflow-hidden mt-2 w-40 bg-black-1300  rounded-md shadow-lg focus:outline-none z-50">
            <div className="">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/stats"
                    className={`block px-4 py-2 text-base font-inter font-medium ${isActive('/stats')
                      ? 'text-primary-color'
                      : active
                        ? 'bg-primary-color'
                        : 'text-white'
                      }`}
                  >
                    Leaderboard
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/stats/analytics"
                    className={`block px-4 py-2 text-base font-inter font-medium ${isActive('/stats/analytics')
                      ? 'text-primary-color'
                      : active
                        ? 'bg-primary-color'
                        : 'text-white'
                      }`}
                  >
                    Analytics
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/stats/profit_loss"
                    className={`block px-4 py-2 text-base font-inter font-medium ${isActive('/stats/profit_loss')
                      ? 'text-primary-color'
                      : active
                        ? 'bg-primary-color'
                        : 'text-white'
                      }`}
                  >
                    P&L
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

export default StatsDropdown;
