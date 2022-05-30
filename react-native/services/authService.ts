import axios from 'axios';
import type { AuthResponse, JoinData } from '../types';


const signIn = (accessToken: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8080/login/oauth2', {
            headers: {
                "Authorization": accessToken
            }
        })
        .then(response => {
            // console.log('response headers',response.headers);
            let data = {
                header: {
                    access_token: response.headers["access-token"],
                    refresh_token: response.headers["refresh-token"]
                },
                body: response.data
            }
            console.log(data);
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    });
};

const signUp = (data: JoinData): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:8080/join', data)
        .then(response => {
            let data = {
                header: {
                    access_token: response.headers["access-token"],
                    refresh_token: response.headers["refresh-token"]
                },
                body: response.data
            }
            console.log(data);
            resolve(data);
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const authService = {
    signIn, signUp
};
