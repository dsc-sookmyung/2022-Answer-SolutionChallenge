import axios from 'axios';
import type { AuthData, JoinData } from '../types';


const signIn = (accessToken: string): Promise<AuthData> => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8080/login/oauth2', {
            headers: {
                "Authorization": accessToken
            }
        })
        .then(response => {
            console.log(response.data);
            resolve(response.data)
        })
        .catch(err => {
            reject(err)
        })
    });
};

const signUp = (data: JoinData): Promise<AuthData> => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:8080/join', data)
        .then(response => {
            console.log(response.data);
            resolve(response.data);
        })
        .catch(err => {
            console.log(err);
            reject(err)
        })
    })
}

export const authService = {
    signIn, signUp
};
