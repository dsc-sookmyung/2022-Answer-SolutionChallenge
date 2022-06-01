import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    Join: undefined;
    Introduction: undefined;
    Home: undefined;
    Translate: undefined;
    Search: undefined;
    Calendar: undefined;
    FullText: undefined;
    SearchResult: undefined;
};

export type Navigation = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type TextInput = {
    errorText: string;
    description: string;
}

interface Children {
    cid: number,
    cname?: string,
    cprofileImg: number,
    color?: number,
}

interface UserInfo {
    uid?: number,
    uprofileImg?: number,
    username?: string,
    ulanguage?: string,
}

interface JoinData extends UserInfo {
    uchildren?: { cname?: string, cprofileImg: number, color?: number }[]
}

interface UserData extends UserInfo {
    uchildren?: Children[],
    uemail?: string | undefined,
    uproviderType?: string | undefined,
    uroleType?: string | undefined,
}

interface AuthData {
    access_token?: string,
    refresh_token?: string,
}

interface AuthResponse {
    header: AuthData,
    body: UserData
}

interface AuthContextData {
    authData?: AuthData;
    userData?: UserData;
    loading: boolean;
    update: boolean;
    signUp(data: JoinData): Promise<void>;
    signIn(accessToken: string): Promise<void>;
    signOut(): void;
    handleUpdate(): void;
};
interface Event {
    id: number, 
	eid: number,
    content: string, 
    date?: string, 
    highlight: boolean, 
    registered: boolean
}

interface Result {
    id?: number,
    imageUri?: string,
    fullText: Event[],
    korean: string,
    trans_full?: string,
	
	title?: string,

	event_num?: number,
	events?: { title: string, date: string }[]
}

interface Notice {
    date: string,
    results: Result[]
}

interface Notices {
    date: string,
	saved: { nid: number, cid: number, title: string }[]
}

interface BottomDrawerProps {
    results: Result,
    showKorean?: boolean,
    isFullDrawer?: boolean,
    isTranslateScreen?: boolean,
    openSaveForm?: boolean,
    handleKorean?: () => void,
    saveResults?: (form: ResultsForm) => void,
    closeResults?: () => void,
    retakePicture?: () => void,
    handleOpenSaveForm?: () => void
}

interface EventForm {
    title: string, 
    date: string, 
    cid: number, 
    description: string
}

interface ResultsForm {
    cid: number,
    title: string
}

export type {
    UserData, JoinData, AuthData, AuthResponse, AuthContextData, Children, 
    Event, Result, Notice, Notices, BottomDrawerProps, EventForm, ResultsForm
}
