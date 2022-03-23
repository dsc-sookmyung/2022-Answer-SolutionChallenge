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
	cid?: number,
	cname?: string,
	color?: number,
}

interface JoinData {
	uid?: number,
	uprofileImg?: number,
	username?: string,
	ulanguage?: string,
	uchildren?: Children[]
}

interface UserData extends JoinData {
    uemail?: string | undefined,
    uproviderType?: string | undefined,
    uroleType?: string | undefined,
}

interface AuthData {
	jwt_token?: string,
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
    signUp(data: JoinData): Promise<void>;
    signIn(accessToken: string): Promise<void>;
    signOut(): void;
};
interface Event {
	id: number, 
	content: string, 
	date?: string, 
	highlight: boolean, 
	registered: boolean
}

interface Result {
	id: number,
	imageUri?: string,
	fullText: Event[],
	korean: string
}

interface Notice {
	id: number,
	cid: number,
	date: string,
	saved_titles: string[],
	results?: Result[]
}

interface BottomDrawerProps {
	results: Result,
	showKorean?: boolean,
	isFullDrawer?: boolean,
	isTranslateScreen?: boolean,
	handleKorean?: () => void,
	saveResults?: () => void,
	closeResults?: () => void,
	retakePicture?: () => void,
}

interface EventForm {
	title: string, 
	date: string, 
	cId: number, 
	description: string
}

export type {
	UserData, JoinData, AuthData, AuthResponse, AuthContextData, Children, 
	Event, Result, Notice, BottomDrawerProps, EventForm
}
