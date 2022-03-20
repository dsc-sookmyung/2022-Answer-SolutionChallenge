import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authService } from '../services/authService';
import { AuthData, UserData, JoinData, AuthContextData } from '../types';


// Create the Auth Context with the data type specified
// and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData>();
    const [userData, setUserData] = useState<UserData>();

    // the AuthContext start with loading equals true
    // and stay like this, until the data be load from Async Storage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Every time the App is opened, this provider is rendered
        // and call de loadStorage function.
        loadStorageData();
    }, []);

    async function loadStorageData(): Promise<void> {
        try {
            //Try get the data from Async Storage
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            const userDataSerialized = await AsyncStorage.getItem('@UserData');
            if (authDataSerialized && userDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const _authData: AuthData = JSON.parse(authDataSerialized);
                const _userData: UserData = JSON.parse(userDataSerialized);
                setAuthData(_authData);
                setUserData(_userData);
            }
        } catch (error) {
        } finally {
            // loading finished
            setLoading(false);
        }
    }

    const signUp = async (data: JoinData) => {
        const _authData = await authService.signUp(data);

        setAuthData(_authData.header);
        setUserData(_authData.body);

        AsyncStorage.setItem('@AuthData', JSON.stringify(_authData.header));
        AsyncStorage.setItem('@UserData', JSON.stringify(_authData.body));
    };

    const signIn = async (accessToken: string) => {
        const _authData = await authService.signIn(accessToken);
        console.log(_authData)

        // Set the data in the context, so the App can be notified
        // and send the user to the AuthStack
        setAuthData(_authData.header);
        setUserData(_authData.body);

        // Persist the data in the Async Storage
        // to be recovered in the next user session.
        AsyncStorage.setItem('@AuthData', JSON.stringify(_authData.header));
        AsyncStorage.setItem('@UserData', JSON.stringify(_authData.body));
    };

    const signOut = async () => {
        // Remove data from context, so the App can be notified
        // and send the user to the AuthStack
        setAuthData(undefined);
        setUserData(undefined);

        // Remove the data from Async Storage
        // to NOT be recoverede in next session.
        await AsyncStorage.removeItem('@AuthData');
        await AsyncStorage.removeItem('@UserData');
    };

    return (
        // This component will be used to encapsulate the whole App,
        // so all components will have access to the Context
        <AuthContext.Provider value={{authData, userData, loading, signUp, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};

// A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};