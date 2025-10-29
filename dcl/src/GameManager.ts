import { ColliderLayer, engine, Entity, Transform, TriggerArea, triggerAreaEventsSystem } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { ghostSpawner } from './GhostSpawner'
import * as ui from './ui'

export enum GameState {
	Lobby,
	Starting,
	Playing,
	GameOver
}

class GameManager {
	private gameState: GameState = GameState.Lobby

	public score: number = 0
	public roundDuration: number = 60
	public timeElapsed: number = 60
	public gameCooldown: number = 5

	// Entities
	private gateLeft: Entity | undefined
	private gateRight: Entity | undefined

	// Spawner stuff
	private timeSinceLastSpawn: number = 0
	private timeToNextSpawn: number = 0
	private spawnInterval: number = 3
	private spawnIntervalVariance: number = 0.75

	constructor() {}

	OnGhostKilled() {
		this.score++
		console.log('Score: ' + this.score)
		// Update UI if needed
		ui.SetScore(this.score)
	}

	Init() {
		// Spawn the trigger zones
		const triggerStart = engine.addEntity()
		Transform.create(triggerStart, {
			position: Vector3.create(13, 1, 15),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale: Vector3.create(2, 3, 6)
		})
		TriggerArea.setBox(triggerStart)
		triggerAreaEventsSystem.onTriggerEnter(triggerStart, (event) => {
			console.log('Trigger entered')
			if (this.gameState == GameState.Lobby) {
				this.StartGame()
			}
		})

		// Find the gates
		for (const gate of engine.getEntitiesByTag('GateLeft')) {
			this.gateLeft = gate
			break
		}
		for (const gate of engine.getEntitiesByTag('GateRight')) {
			this.gateRight = gate
			break
		}

		if (!this.gateLeft || !this.gateRight) {
			console.error('No gates found')
			return
		}

		// Set up ghost spawner callback
		ghostSpawner.SetOnGhostKilledCallback(() => this.OnGhostKilled())

		this.StartLobby()
	}

	StartLobby() {
		console.log('Starting lobby')
		this.gameState = GameState.Lobby
		this.OpenGates()

		// Reset the things
		this.timeElapsed = 0
		this.score = 0
		this.timeToNextSpawn = this.spawnInterval
	}

	StartGame() {
		console.log('Starting game')
		this.gameState = GameState.Playing
		this.CloseGates()

		this.timeElapsed = 0

		engine.addSystem((dt: number) => {
			this.System_GameRunner(dt)
		})
	}

	GameOver() {
		console.log('Game over')
		// Stop the game runner
		this.gameState = GameState.GameOver
		engine.removeSystem(this.System_GameRunner)

		// Clear the ghosts
		ghostSpawner.GameOver()

		utils.timers.setTimeout(() => {
			this.StartLobby()
		}, this.gameCooldown)
	}

	System_GameRunner(dt: number) {
		if (this.gameState != GameState.Playing) {
			console.log('Game not playing')
			return
		}

		this.timeElapsed += dt

		// Update the UI timer
		if (Math.floor(this.timeElapsed) != ui.timerValue) {
			ui.SetTimer(this.roundDuration - Math.floor(this.timeElapsed))
		}

		// Check if the game is over
		if (this.timeElapsed >= this.roundDuration) {
			this.GameOver()
			return
		}

		// Spawn a ghost
		this.timeSinceLastSpawn += dt
		if (this.timeSinceLastSpawn >= this.timeToNextSpawn) {
			this.timeSinceLastSpawn = 0
			this.timeToNextSpawn = this.spawnInterval + Math.random() * this.spawnIntervalVariance
			ghostSpawner.SpawnGhost()
		}
	}

	OpenGates() {
		if (!this.gateLeft || !this.gateRight) {
			console.error('No gates found')
			return
		}

		const duration = 0.4
		utils.tweens.startRotation(
			this.gateLeft,
			Quaternion.fromEulerDegrees(0, 0, 0),
			Quaternion.fromEulerDegrees(0, 90, 0),
			duration,
			utils.InterpolationType.EASEEXPO
		)
		utils.tweens.startRotation(
			this.gateRight,
			Quaternion.fromEulerDegrees(0, 180, 0),
			Quaternion.fromEulerDegrees(0, 90, 0),
			duration,
			utils.InterpolationType.EASEEXPO
		)
	}

	CloseGates() {
		if (!this.gateLeft || !this.gateRight) {
			console.error('No gates found')
			return
		}

		const duration = 0.4
		utils.tweens.startRotation(
			this.gateLeft,
			Quaternion.fromEulerDegrees(0, 90, 0),
			Quaternion.fromEulerDegrees(0, 0, 0),
			duration,
			utils.InterpolationType.EASEEXPO
		)
		utils.tweens.startRotation(
			this.gateRight,
			Quaternion.fromEulerDegrees(0, 90, 0),
			Quaternion.fromEulerDegrees(0, 180, 0),
			duration,
			utils.InterpolationType.EASEEXPO
		)
	}
}

export const gameManager = new GameManager()
