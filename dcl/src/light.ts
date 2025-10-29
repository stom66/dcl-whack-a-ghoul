import { engine, LightSource, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color3, Vector3 } from '@dcl/sdk/math'

export function spawnLights() {
	// entrance light
	const light = engine.addEntity()
	Transform.create(light, {
		position: Vector3.create(8, 5.25, 15)
	})
	LightSource.create(light, {
		type: LightSource.Type.Point({}),
		color: Color3.Red(),
		shadow: false,
		intensity: 32 * 1000
	})

	// window light
	const light2 = engine.addEntity()
	Transform.create(light2, {
		position: Vector3.create(26.05, 2.5, 20.51)
	})
	LightSource.create(light2, {
		type: LightSource.Type.Point({}),
		color: Color3.fromHexString('#FFA500'),
		shadow: false,
		intensity: 32 * 1000
	})

	// high candle
	const light3 = engine.addEntity()
	Transform.create(light3, {
		position: Vector3.create(20.57, 4.75, 19)
	})
	LightSource.create(light3, {
		type: LightSource.Type.Point({}),
		color: Color3.fromHexString('#FFA500'),
		shadow: false,
		intensity: 32 * 1000
	})
}
