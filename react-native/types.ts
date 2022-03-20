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
	color?: string,
}

interface JoinData {
	uid?: number,
	uprofileImg?: number,
	username?: string,
	ulanguage?: string,
	uchildren?: Children[]
}

interface AuthData extends JoinData {
    uemail?: string | undefined,
    uproviderType?: string | undefined,
    uroleType?: string | undefined,

	jwt_token?: string,
	refresh_token?: string,
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
	fullText: Event[],
	korean: string
}

interface Notice {
	userId: number,
	childId: number,
	date: string,
	notices: {
		total_results: string[],
		notice_body: {
			title: string,
			id: number,
			summary: {id: number, content: string, highlight: boolean, registered: boolean}[],
			fullText: string,
			korean: string,
		}[]
	}
}

interface UserProfile {
	userId: number;
	username: string;
	gmail: string;
	profileImageType: number; // 1 or 2
	language: string; // 'english', 'japanese', 'chinese', ...
	children: {childName: string, childId: number}[];
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
	childId: number, 
	description: string
}

export type {
	AuthData, JoinData, Children, 
	Event, Result, Notice, UserProfile, BottomDrawerProps, EventForm
}
