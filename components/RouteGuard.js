import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register', '/', '/_error'];

export default function RouteGuard(props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  function authCheck(url) {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  useEffect(() => {
    authCheck(router.pathname);
    if (isAuthenticated()) {
      updateAtoms();
    }
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return <>{authorized && props.children}</>;
}