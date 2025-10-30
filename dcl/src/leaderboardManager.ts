import { engine, Entity, TextAlignMode, TextShape, Transform } from '@dcl/sdk/ecs'
import { _Leaderboard } from './class.Leaderboard'
import { MessageBus } from '@dcl/sdk/message-bus'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

class LeaderboardManager {
	public scores: string = '1'
	public usernames: string = 'User'

	private usernamesTextObject: Entity | undefined
	private scoresTextObject: Entity | undefined

	constructor() {}

	Init() {
		this.UpdateResults()

		const parentEntity = engine.addEntity()
		Transform.create(parentEntity, {
			position: Vector3.create(9.3, 1.25, 10.2),
			rotation: Quaternion.fromEulerDegrees(0, 135, 0)
		})

		this.usernamesTextObject = engine.addEntity()
		Transform.create(this.usernamesTextObject, {
			position: Vector3.create(-0.15, -0.2, 0),
			parent: parentEntity
		})
		TextShape.create(this.usernamesTextObject, {
			text: this.usernames,
			fontSize: 0.7,
			fontAutoSize: false,
			textAlign: TextAlignMode.TAM_MIDDLE_LEFT
		})

		this.scoresTextObject = engine.addEntity()
		Transform.create(this.scoresTextObject, {
			position: Vector3.create(-0.2, -0.2, 0),
			parent: parentEntity
		})
		TextShape.create(this.scoresTextObject, {
			text: this.scores,
			fontSize: 0.7,
			fontAutoSize: false,
			textAlign: TextAlignMode.TAM_MIDDLE_RIGHT
		})
	}

	// MARK: UpdateResults
	public async UpdateResults() {
		const leaderboardResults = await _Leaderboard.getLeaderboard()
		console.log('Got leaderboard results:', leaderboardResults)

		this.scores = ''
		this.usernames = ''

		for (const [index, result] of leaderboardResults.entries()) {
			this.scores += result.score.toLocaleString() + '\n'
			this.usernames += result.username + '\n'
		}

		if (!this.usernamesTextObject || !this.scoresTextObject) {
			console.error('usernamesTextObject or scoresTextObject is undefined')
			return
		}

		const u = TextShape.getMutable(this.usernamesTextObject)
		u.text = this.usernames
		const s = TextShape.getMutable(this.scoresTextObject)
		s.text = this.scores

		console.log('Updated scores:', this.scores, this.usernames)
	}
}

export const leaderboardManager = new LeaderboardManager()

// MARK: MessageBus

const sceneMessageBus = new MessageBus()
sceneMessageBus.on('UpdateLeaderboard', () => {
	console.log('sceneMessageBus: UpdateLeaderboard')
	leaderboardManager.UpdateResults()
})
