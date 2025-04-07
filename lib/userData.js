import { getToken } from './authenticate';

async function makeRequest(url, method) {
  const res = await fetch(url, {
    method,
    headers: { 
      'Authorization': `JWT ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return res.status === 200 ? await res.json() : [];
}


export async function getFavourites() {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, 'GET');
}

export async function addToFavourites(id) {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'DELETE');
}


export async function getHistory() {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history`, 'GET');
}

export async function addToHistory(id) {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'DELETE');
}