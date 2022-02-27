import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../core/theme';


interface BottomDrawerProps {
	results?: {"content": string; "highlight": boolean}[],
	fullText?: {"translated": string; "korean": string},
	showFullText?: boolean,
	showTranslated?: boolean,
	isFullDrawer?: boolean,
	save?: boolean,
	handleFullText?: () => void,
	saveResults?: () => void,
	handleTranslatedText?: () => void,
	closeResults?: () => void,
	retakePicture?: () => void,
}

const NO_WIDTH_SPACE = '​';
const highlight = (text: string) =>
  text.split(' ').map((word, i) => (
    <Text key={i}>
      <Text style={styles.highlighted}>{word} </Text>
      {NO_WIDTH_SPACE}
    </Text>
  ));

function BottomDrawer(props: BottomDrawerProps) {

	return (
		<View style={styles.bottomDrawer}>
			<View style={{ flex: 1 }}>
				<View style={styles.horizontalLine} />
				<View style={[styles.spaceBetween, { paddingBottom: 24 }]}>
					<Text style={styles.title}>{props.showFullText ? "Full Text" : "Results"}</Text>
					{!props.showFullText ? (
						<View style={styles.alignRow}>
							<TouchableOpacity style={styles.rightSpace} onPress={props.handleFullText}>
								<Entypo name="text" size={32} color="#000"/>
							</TouchableOpacity>
							{props.save &&
								<TouchableOpacity onPress={props.saveResults}>
									<FontAwesome name="save" size={32} color='#000' />
								</TouchableOpacity>
							}
						</View>
					) : (
						<TouchableOpacity style={styles.rightSpace} onPress={props.handleTranslatedText}>
							<MaterialIcons name="translate" size={32} color="#000"/>
						</TouchableOpacity>
					)}
				</View>
				
				<ScrollView style={{ flex: 1 }}>
					{!props.showFullText ? (
						props.results?.map((result, index) => 
							<Text key={result.content} style={styles.content}>
								{index+1}.&nbsp; 
								{result.highlight ? (
									highlight(result.content)
								) : (
									result.content
								)}
							</Text>
						)
					) : (
						props.showTranslated ? (
							<Text style={styles.content}>{props.fullText?.translated}</Text>
						) : (
							<Text style={styles.content}>{props.fullText?.korean}</Text>
						)
					)}
				</ScrollView>
			</View>
			<View style={[styles.spaceBetween, props.isFullDrawer && styles.full ]}>
				{!props.showFullText ? (
					<TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={props.closeResults}>
						<Text style={styles.whiteText}>Close</Text>
					</TouchableHighlight>
				) : (
						<TouchableHighlight style={[styles.regularButton, styles.grayBackground]} onPress={props.handleFullText}>
							<Text style={styles.whiteText}>Back</Text>
						</TouchableHighlight>
				)}
				<View style={styles.gap} />
				<TouchableHighlight style={[styles.regularButton, styles.primaryBackground]} onPress={props.retakePicture}>
					<Text style={styles.whiteText}>Try again</Text>
				</TouchableHighlight>
			</View>
		</View>
	)
}

export default BottomDrawer

const styles = StyleSheet.create({
	bottomDrawer: {
		flex: 1,
		flexDirection: 'column',
		alignContent: 'space-between',
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: 48,
		borderTopRightRadius: 48,
		padding: 32
	},
	horizontalLine: {
		flex: 1,
		marginHorizontal: Dimensions.get('window').width*0.33,
		marginBottom: 32,
		height: 4,
		maxHeight: 4,
		justifyContent: 'center',
		backgroundColor: theme.colors.gray
	},
	title: {
		fontFamily: 'Lora_700Bold',
		fontSize: 24,
		fontWeight: '700',
		color: theme.colors.primary,
	},
	content: {
		fontSize: 16,
		paddingBottom: 8
	},
	regularButton: {
		paddingVertical: 16,
		flex: 0.9,
		marginTop: 16,
		alignItems: 'center',
		borderRadius: 16
	},
	gap: {
		flex: 0.1
	},
	primaryBackground: {
		backgroundColor: theme.colors.primary
	},
	grayBackground: {
		backgroundColor: theme.colors.gray
	},
	spaceBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	alignRow: {
		flexDirection: 'row'
	},
	highlighted: {
		backgroundColor: theme.colors.skyblue
	},
	rightSpace: {
		paddingRight: 8
	},
	whiteText: {
		color: '#fff',
		fontSize: 16
	},
	full: {
		paddingBottom: 96
	},
})
