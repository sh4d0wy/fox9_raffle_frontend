import { Link, useLocation } from '@tanstack/react-router';

function DynamicNewLink({ isAuth }: { isAuth: boolean }) {
  const location = useLocation();
  let linkTo = '';
  let enabled = false;

  if (location.pathname === '/raffles') {
    linkTo = '/raffles/create_raffles';
    enabled = true;
  } else if (location.pathname.startsWith('/auctions')) {
    linkTo = '/auctions/create_auctions';
    enabled = true;
  } else if (location.pathname.startsWith('/gumballs')) {
    linkTo = '/gumballs/create_gumballs';
    enabled = true;
  }

  const isClickable = isAuth && enabled;

  return (
    <Link
      to={isClickable ? linkTo : '#'}
      className={`h-11 xl:px-8 px-5 py-2.5 border rounded-full flex items-center gap-2.5 transition duration-300 ${isClickable
        ? 'bg-primary-color border-black-1000 hover:border-primary-color'
        : 'border border-black-1000 cursor-not-allowed opacity-50 pointer-events-none'
        }`}
    >
      <img src="/icons/plus-icon.svg" className="size-4" />
      <span className="text-neutral-800 text-base font-semibold font-inter">
        New
      </span>
    </Link>
  );
}

export default DynamicNewLink;
