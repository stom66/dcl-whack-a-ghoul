import {
	AudioSource,
	ColliderLayer,
	engine,
	Entity,
	GltfContainer,
	InputAction,
	MeshCollider,
	PointerEvents,
	pointerEventsSystem,
	Transform
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

class GhostSpawner {
	private ghosts: Entity[]
	private graves: Entity[]
	private spawnedGhosts: Entity[]

	public caughtGhosts: number = 0
	private onGhostKilledCallback?: () => void

	// Settings
	private ghostRiseSpeed: number = 1
	private ghostMaxHeight: number = 10
	private lastGraveIndex: number = 0
	private lastSfxIndex: number = 0

	private sfxGhostSpawn: string[] = [
		'assets/sfx/spooky_ghost_wail_1.mp3',
		'assets/sfx/spooky_ghost_wail_2.mp3',
		'assets/sfx/spooky_ghost_wail_3.mp3',
		'assets/sfx/spooky_ghost_wail_4.mp3'
	]

	constructor() {
		this.ghosts = []
		this.graves = []
		this.spawnedGhosts = []
	}

	Init() {
		const ghouls = engine.getEntitiesByTag('Ghoul')
		for (const ghoul of ghouls) {
			this.ghosts.push(ghoul)
		}
		console.log('Found ' + this.ghosts.length + ' ghouls')

		const graves = engine.getEntitiesByTag('Grave')
		for (const grave of graves) {
			this.graves.push(grave)
		}
		console.log('Found ' + this.graves.length + ' graves')
	}

	SetOnGhostKilledCallback(callback: () => void) {
		this.onGhostKilledCallback = callback
	}

	SpawnGhost() {
		console.log('Spawning ghost')

		// Choose a grave spawn point
		var graveIndex = this.lastGraveIndex
		while (graveIndex == this.lastGraveIndex) {
			graveIndex = Math.floor(Math.random() * this.graves.length)
		}
		this.lastGraveIndex = graveIndex
		const grave = this.graves[graveIndex]
		const t = Transform.get(grave)

		// Chose a ghost to spawn
		const ghostToClone = this.ghosts[Math.floor(Math.random() * this.ghosts.length)] // clone the object

		const ghost = engine.addEntity()
		GltfContainer.create(ghost, { ...GltfContainer.get(ghostToClone) })
		Transform.create(ghost, {
			position: Vector3.add(t.position, Vector3.create(0, 0, 0)),
			rotation: t.rotation,
			scale: t.scale
		})
		MeshCollider.setBox(ghost, ColliderLayer.CL_POINTER)

		// Play a sound effect
		var sfxIndex = this.lastSfxIndex
		while (sfxIndex == this.lastSfxIndex) {
			sfxIndex = Math.floor(Math.random() * this.sfxGhostSpawn.length)
		}
		this.lastSfxIndex = sfxIndex
		AudioSource.create(ghost, {
			audioClipUrl: this.sfxGhostSpawn[sfxIndex],
			loop: false,
			playing: true
		})

		// Setup pointer event
		pointerEventsSystem.onPointerDown(
			{
				entity: ghost,
				opts: {
					button: InputAction.IA_PRIMARY,
					hoverText: 'Catch Ghost 👻'
				}
			},
			() => {
				console.log('Pointer down')
				this.KillGhost(ghost)
			}
		)

		utils.tweens.startTranslation(
			ghost,
			t.position,
			Vector3.create(t.position.x, this.ghostMaxHeight, t.position.z),
			this.ghostMaxHeight / this.ghostRiseSpeed,
			utils.InterpolationType.EASEINQUAD,
			() => {
				utils.tweens.startScaling(ghost, Vector3.One(), Vector3.Zero(), 0.25, utils.InterpolationType.EASEEXPO, () => {
					this.spawnedGhosts.splice(this.spawnedGhosts.indexOf(ghost), 1)
					engine.removeEntity(ghost)
				})
			}
		)
	}

	KillGhost(ghost: Entity) {
		console.log('Killing ghost')
		utils.tweens.stopRotation(ghost)
		utils.tweens.stopScaling(ghost)
		utils.tweens.stopTranslation(ghost)
		this.spawnedGhosts.splice(this.spawnedGhosts.indexOf(ghost), 1)
		engine.removeEntity(ghost)

		// Notify game manager via callback
		if (this.onGhostKilledCallback) {
			this.onGhostKilledCallback()
		}
	}

	GameOver() {
		for (const ghost of this.spawnedGhosts) {
			engine.removeEntity(ghost)
		}
		this.spawnedGhosts = []
	}
}

export const ghostSpawner = new GhostSpawner()
