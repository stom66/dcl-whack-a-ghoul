import {
	AudioSource,
	ColliderLayer,
	engine,
	Entity,
	GltfContainer,
	GltfNodeModifiers,
	InputAction,
	LightSource,
	MeshCollider,
	PointerEvents,
	pointerEventsSystem,
	Transform
} from '@dcl/sdk/ecs'
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

class GhostSpawner {
	private ghosts: Entity[]
	private graves: Entity[]
	private spawnedGhosts: Entity[]

	public caughtGhosts: number = 0
	private onGhostKilledCallback?: (score: number) => void
	private onGhostEscapedCallback?: () => void

	// Settings
	private ghostRiseSpeed: number = 1.5
	private ghostMaxHeight: number = 10
	private lastGraveIndex: number = 0
	private lastSpawnSfxIndex: number = 0
	private lastDeathSfxIndex: number = 0
	private lastEscapeSfxIndex: number = 0

	private sfxGhostSpawn: string[] = [
		'assets/sfx/spooky_ghost_wail_1.mp3',
		'assets/sfx/spooky_ghost_wail_2.mp3',
		'assets/sfx/spooky_ghost_wail_3.mp3',
		'assets/sfx/spooky_ghost_wail_4.mp3'
	]
	private sfxGhostDeath: string[] = [
		'assets/sfx/ghost_death_01.mp3',
		'assets/sfx/ghost_death_02.mp3',
		'assets/sfx/ghost_death_03.mp3',
		'assets/sfx/ghost_death_04.mp3',
		'assets/sfx/ghost_death_05.mp3',
		'assets/sfx/ghost_death_06.mp3',
		'assets/sfx/ghost_death_07.mp3',
		'assets/sfx/ghost_death_08.mp3'
	]
	private sfxGhostEscape: string[] = ['assets/sfx/ghost_escape_01.mp3', 'assets/sfx/ghost_escape_02.mp3']

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

	SetOnGhostKilledCallback(callback: (score: number) => void) {
		this.onGhostKilledCallback = callback
	}

	SetOnGhostEscapedCallback(callback: () => void) {
		this.onGhostEscapedCallback = callback
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

		// create the new ghost entity
		const ghost = engine.addEntity()
		GltfContainer.create(ghost, { ...GltfContainer.get(ghostToClone) })
		Transform.create(ghost, {
			position: Vector3.create(t.position.x, -2, t.position.z),
			rotation: Quaternion.multiply(t.rotation, Quaternion.fromEulerDegrees(0, 180, 0))
		})
		MeshCollider.setBox(ghost, ColliderLayer.CL_POINTER)

		// Play a spawn sound effect
		var sfxIndex = this.lastSpawnSfxIndex
		while (sfxIndex == this.lastSpawnSfxIndex) {
			sfxIndex = Math.floor(Math.random() * this.sfxGhostSpawn.length)
		}
		this.lastSpawnSfxIndex = sfxIndex
		AudioSource.createOrReplace(ghost, {
			audioClipUrl: this.sfxGhostSpawn[sfxIndex],
			loop: false,
			playing: true
		})

		// Attach a light
		const ghostLight = engine.addEntity()
		Transform.create(ghostLight, {
			position: Vector3.create(0, -0.5, 0),
			parent: ghost
		})
		LightSource.create(ghostLight, {
			type: LightSource.Type.Point({}),
			color: Color3.Green(),
			shadow: false,
			intensity: 8000
		})

		// Update the material to emit a bit
		GltfNodeModifiers.create(ghost, {
			modifiers: [
				{
					path: '',
					material: {
						material: {
							$case: 'pbr',
							pbr: {
								emissiveColor: Color4.create(Math.random() * 0.2, Math.random(), Math.random() * 0.1, 0.2)
							}
						}
					}
				}
			]
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
				// Play the escape sound effect
				var sfxIndex = this.lastEscapeSfxIndex
				while (sfxIndex == this.lastEscapeSfxIndex) {
					sfxIndex = Math.floor(Math.random() * this.sfxGhostEscape.length)
				}
				this.lastEscapeSfxIndex = sfxIndex
				AudioSource.createOrReplace(ghost, {
					audioClipUrl: this.sfxGhostEscape[sfxIndex],
					loop: false,
					playing: true
				})

				if (this.onGhostEscapedCallback) {
					this.onGhostEscapedCallback()
				}

				utils.tweens.startScaling(ghost, Vector3.One(), Vector3.Zero(), 0.5, utils.InterpolationType.EASEEXPO, () => {
					utils.timers.setTimeout(() => {
						this.spawnedGhosts.splice(this.spawnedGhosts.indexOf(ghost), 1)
						engine.removeEntity(ghost)
					}, 2000)
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

		const t = Transform.getMutable(ghost)
		utils.tweens.startTranslation(
			ghost,
			t.position,
			Vector3.create(t.position.x, -10, t.position.z),
			0.4,
			utils.InterpolationType.EASEINQUAD,
			() => {
				utils.timers.setTimeout(() => {
					engine.removeEntity(ghost)
				}, 2000)
			}
		)

		// Play the death noise
		var sfxIndex = this.lastDeathSfxIndex
		while (sfxIndex == this.lastDeathSfxIndex) {
			sfxIndex = Math.floor(Math.random() * this.sfxGhostDeath.length)
		}
		this.lastDeathSfxIndex = sfxIndex
		AudioSource.createOrReplace(ghost, {
			audioClipUrl: this.sfxGhostDeath[sfxIndex],
			loop: false,
			playing: true
		})

		// Notify game manager via callback
		if (this.onGhostKilledCallback) {
			const score = this.ghostMaxHeight - Math.floor(t.position.y)
			this.onGhostKilledCallback(score)
		}
	}

	GameOver() {
		for (const ghost of this.spawnedGhosts) {
			utils.tweens.stopRotation(ghost)
			utils.tweens.stopScaling(ghost)
			utils.tweens.stopTranslation(ghost)
			engine.removeEntity(ghost)
		}
		this.spawnedGhosts = []
	}
}

export const ghostSpawner = new GhostSpawner()
