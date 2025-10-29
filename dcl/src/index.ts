import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { engine, Transform, GltfContainer, AudioSource } from '@dcl/sdk/ecs'
//
// Note the 180 rotation, this is so that position in Blender align with positions in DCL (with Y and Z swapped)

import { Settings } from './_settings'
import { setupUi } from './ui'
import { gameManager } from './GameManager'
import { ghostSpawner } from './GhostSpawner'
import { spawnLights } from './light'
import { musicManager } from './musicManager'

export function main() {
	setupUi()
	ghostSpawner.Init()
	gameManager.Init()
	spawnLights()
	musicManager.Init()
}
