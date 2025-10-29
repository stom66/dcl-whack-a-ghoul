import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { engine, Transform, GltfContainer, AudioSource } from '@dcl/sdk/ecs'
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import { setupUi } from './ui'
import { gameManager } from './GameManager'
import { ghostSpawner } from './GhostSpawner'
import { spawnLights } from './light'
import { musicManager } from './musicManager'
import { leaderboardManager } from './leaderboardManager'

export function main() {
	gameManager.Init()
	ghostSpawner.Init()
	leaderboardManager.Init()
	musicManager.Init()

	setupUi()
	spawnLights()
}
