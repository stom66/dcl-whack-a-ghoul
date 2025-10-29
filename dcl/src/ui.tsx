import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponent)
}

export var timerIsVisible = true
export var timerValue = 0

export var scoreIsVisible = true
export var scoreValue = 0

export var ammoIsVisible = true
export var ammoValue = 0

export function SetTimer(value: number) {
	timerValue = value
}

export function SetScore(value: number) {
	scoreValue = value
}


const uiComponent = () => (
	<UiEntity
		uiTransform={{
			width: "100%",
			height: "100%",
			margin: '0',
			padding: 0,
			alignContent: 'center',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		}}
		uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0) }}
	>	
		<UiEntity
			uiTransform={{
				width: "480px",
				height: "90px",
				margin: '0',
				padding: "48px 0 0 0",
				alignContent: 'center',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
			uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
		>
			<UiEntity
				key="frame_timer"
				uiTransform={{
					width: "50%",
					height: "100%",
					padding: "8px 30px",
					display: timerIsVisible ? 'flex' : 'none',
					alignContent: 'center',
					flexDirection: 'column',
				}}
				uiBackground={{
					//color: Color4.create(0.5, 0.1, 0.8, 0.6),
					texture: {
					src       : "images/Button00_s.png"
					},
					textureMode: "nine-slices",
					textureSlices: {
						top   : 0.5,
						bottom: 0.5,
						left  : 0.2, 
						right : 0. 
					}
				}}
			>
				<Label
					value       = {`Time: ${timerValue}`}
					fontSize    = {18}
					uiTransform = {{ width: '100%', height: "100%" }}
				/>
			</UiEntity>
			
			<UiEntity
				key="frame_score"
				uiTransform={{
					width         : "50%",
					height        : "100%",
					padding       : "32px 38px",
					display       : scoreIsVisible ? 'flex' : 'none',
					flexDirection : 'row',
					justifyContent: 'space-between',
					alignItems    : 'center',
					alignContent  : 'center',

				}}
				uiBackground={{
					//color: Color4.create(0.5, 0.1, 0.8, 0.6),
					texture: {
						src       : "images/Button00_s.png"
					},
					textureMode: "nine-slices",
					textureSlices: {
						top   : 0.5,
						bottom: 0.5,
						left  : 0.5, 
						right : 0.5
					}
				}}
			>
				<UiEntity
					uiTransform={{ 
						width: '30px', 
						height: "30px",
						alignSelf: 'baseline',
					}}
					uiBackground={{ 
						texture: {
							src: 'images/btn_timer_f.png'
						},
						textureMode: 'stretch',
					 }}
				></UiEntity>
				<Label
					value       = {`Score: ${scoreValue}`}
					fontSize    = {18}
					uiTransform = {{ 
						width: '50%', 
						height: "30px",
						flexGrow: 1,
						alignSelf: 'center',
					 }}
				/>
			</UiEntity>
		</UiEntity>
	</UiEntity>
)

