import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
	Login: undefined;
	Join: undefined;
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

interface Result {
	id: number,
	summary: {id: number, content: string, highlight: boolean, registered: boolean}[],
	fullText: string,
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
	showFullText?: boolean,
	isFullDrawer?: boolean,
	isTranslateScreen?: boolean,
	handleFullText?: () => void,
	saveResults?: () => void,
	closeResults?: () => void,
	retakePicture?: () => void,
}

export type {
	AuthData, JoinData, Children, 
	Result, Notice, UserProfile, BottomDrawerProps
}
