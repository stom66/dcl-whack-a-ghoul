import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as utils from '@dcl-sdk/utils'

export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponent)
}

export var timerScoreIsVisible = true
export var timerValue = 0

export var scoreValue = 999

var gameStartIsVisible = false
var gameOverIsVisible = true


export function SetTimer(value: number) {
	timerValue = value
}

export function SetScore(value: number) {
	scoreValue = value
}

export function OnGameStart() {
	timerScoreIsVisible = true
	gameStartIsVisible = true


	utils.timers.setTimeout(() => {
		gameStartIsVisible = false
	}, 5000)
}

export function OnGameOver() {
	gameOverIsVisible = true
}

export function OnLobbyReset() {
	timerScoreIsVisible = false
	gameStartIsVisible = false
	gameOverIsVisible = false
	scoreValue = 0
	timerValue = 0
}

const uiComponent = () => (
	<UiEntity
		key="ui_root"
		uiTransform={{
			width: "100%",
			height: "100%",
			margin: '0',
			padding: 0,
			alignContent: 'center',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
		}}
		//uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0) }}
	>	
		<UiEntity
			key="ui_timer_and_score"
			uiTransform={{
				width: "480px",
				height: "123px",
				alignContent: 'center',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				margin: '32px 0 0 0',
				flexGrow: 0,
				flexShrink: 0,
			}}
			//uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
		>
			<UiEntity
				key="timer"
				uiTransform={{
					width: "240px",
					height: "123px",
					flexDirection: 'row-reverse',
					flexGrow: 0,
					flexShrink: 0,
					alignItems: 'center',
					padding: '0 0px 0 0',
					display: timerScoreIsVisible ? 'flex' : 'none',
				}}
				uiBackground={{
					//color: Color4.create(1, 0.1, 0, 1),
					texture: {
						src       : "images/timer.png"
					},
				}}
			>
				<Label
					value       = {`${timerValue}`}
					fontSize    = {92}
					//uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
					uiTransform = {{ 
						width: '60%', 
						height: "80%" ,
						flexGrow: 0,
						flexShrink: 0,
						alignContent: 'center'
					}}
					textAlign = 'middle-center'
				/>
			</UiEntity>
			

			<UiEntity
				key="score"
				uiTransform={{
					width: "240px",
					height: "123px",
					flexDirection: 'row-reverse',
					flexGrow: 0,
					flexShrink: 0,
					alignItems: 'center',
					display: timerScoreIsVisible ? 'flex' : 'none',
				}}
				uiBackground={{
					//color: Color4.create(1, 0.1, 0, 1),
					texture: {
						src       : "images/score.png"
					},
				}}
			>
				<Label
					value       = {`${scoreValue}`}
					fontSize    = {56}
					//uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.8) }}
					uiTransform = {{ 
						width: '50%', 
						height: "60%" ,
						flexGrow: 0,
						flexShrink: 0,
						alignContent: 'center',
						padding: '0 16px 116px 16px'
					}}
					textAlign = 'middle-center'
				/>
			</UiEntity>
		</UiEntity>

				
		<UiEntity
			key="ui_game_start"
			uiTransform={{
				width: "470px",
				height: "216px",
				alignContent: 'center',
				display: gameStartIsVisible ? 'flex' : 'none',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				margin: '0px 0 64px 0',
				flexGrow: 0,
				flexShrink: 0,
			}}
			uiBackground={{ 
				//color: Color4.create(0.5, 0.8, 0.1, 0.6),
				texture: {
					src: "images/game-start.png"
				},
				textureMode: 'stretch'
			}}
		></UiEntity>

				
		<UiEntity
			key="ui_game_start"
			uiTransform={{
				width: "470px",
				height: "216px",
				alignContent: 'center',
				display: gameOverIsVisible ? 'flex' : 'none',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				margin: '0px 0 64px 0',
				flexGrow: 0,
				flexShrink: 0,
			}}
			uiBackground={{ 
				//color: Color4.create(0.5, 0.8, 0.1, 0.6),
				texture: {
					src: "images/game-over.png"
				},
				textureMode: 'stretch'
			}}
		></UiEntity>
	</UiEntity>
)

