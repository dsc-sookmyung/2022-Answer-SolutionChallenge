import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
	Login: undefined;
	Join: undefined;
	ForgotPassword: undefined;
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

export type Notice = {
	userId: number,
	childId: number,
	date: string,
	notices: {
		total_results: string[],
		notice_body: {
			id: number,
			title: string,
			summary: {id: number; content: string; highlight: boolean}[],
			fullText: string,
			korean: string,
		}[]
	}
}

export interface UserProfile {
	userId: number;
	username: string;
	gmail: string;
	profileImageType: number; // 1 or 2
	language: string; // 'english', 'japanese', 'chinese', ...
	children: {childName: string, childId: number}[];
}
