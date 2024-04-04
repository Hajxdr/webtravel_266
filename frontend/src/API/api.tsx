import axios, { AxiosRequestConfig } from 'axios';
import { ApiConfig } from '../Config/ApiConfig';

export interface ApiResponse<T = any> {
    status: 'ok' | 'error' | 'login' | 'forbidden';
    data?: T | null;
}

export default async function api<T = any>(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete' | 'put',
    body?: any
): Promise<ApiResponse<T>> {
    let role: 'user' | 'admin' | 'guest' = 'guest';

    // Provjeri da li postoji kolačić 'userRole' i postavi ulogu
    const userRoleCookie = document.cookie.replace(/(?:(?:^|.*;\s*)userRole\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (userRoleCookie === 'user' || userRoleCookie === 'admin') {
        role = userRoleCookie;
    }

    const requestData: AxiosRequestConfig = {
        method: method,
        url: ApiConfig.API_URL + path,
        data: body,
        withCredentials: true, // proslijediti kuki tj. sesiju sa zahtjevom
        headers: {
            'X-User-Role': role // Dodajte ulogu u zaglavlje zahtjeva
        }
    };

    try {
        const response = await axios(requestData);
        return { status: 'ok', data: response.data };
    } catch (error:any) {
        if (error.response.status === 401) {
            return { status: 'login', data: error.response.data };
        } else if (error.response.status === 403) {
            return { status: 'forbidden', data: error.response.data };
        } else {
            return { status: 'error', data: error.response.data };
        }
    }
}


