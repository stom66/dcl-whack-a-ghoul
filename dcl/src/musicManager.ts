import { AudioSource, engine, Entity, Transform } from '@dcl/sdk/ecs'

class MusicManager {
	private bgm: Entity | undefined
	private gameOver: Entity | undefined

	private gameOverSfx = ['assets/sfx/game_over_01.mp3', 'assets/sfx/game_over_02.mp3']

	constructor() {}

	Init() {
		this.bgm = engine.addEntity()
		Transform.create(this.bgm)
		AudioSource.createOrReplace(this.bgm, {
			audioClipUrl: 'assets/sfx/bgm_01.mp3',
			loop: true,
			playing: false,
			global: true,
			volume: 0.5
		})

		this.gameOver = engine.addEntity()
		Transform.create(this.gameOver)
		AudioSource.createOrReplace(this.gameOver, {
			audioClipUrl: this.gameOverSfx[0],
			loop: false,
			playing: false,
			global: true,
			volume: 0.5
		})
	}

	PlayBGM() {
		if (!this.bgm) {
			return
		}
		const audioSource = AudioSource.getMutable(this.bgm)
		audioSource.playing = true
	}

	StopBGM() {
		if (!this.bgm) {
			return
		}
		const audioSource = AudioSource.getMutable(this.bgm)
		audioSource.playing = false
	}

	PlayGameOver() {
		if (!this.gameOver) {
			return
		}

		const randomIndex = Math.floor(Math.random() * this.gameOverSfx.length)
		const audioSource = AudioSource.getMutable(this.gameOver)
		audioSource.audioClipUrl = this.gameOverSfx[randomIndex]
		audioSource.playing = true
	}
}

export const musicManager = new MusicManager()
