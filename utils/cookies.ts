import Cookies from 'js-cookie';

// Set a cookie
export const setCookie = (name: string, value: string, options = {}) => {
  Cookies.set(name, value, { 
    expires: 30, // 30 days by default
    path: '/',
    ...options 
  });
};

// Get a cookie
export const getCookie = (name: string) => {
  return Cookies.get(name);
};

// Remove a cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name);
}; 