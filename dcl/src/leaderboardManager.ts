import { _Leaderboard } from './class.Leaderboard'
import { MessageBus } from '@dcl/sdk/message-bus'

class LeaderboardManager {
	public scores: string = ''
	public usernames: string = ''

	constructor() {}

	Init() {
		this.UpdateResults()
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
	}
}

export const leaderboardManager = new LeaderboardManager()

// MARK: MessageBus

const sceneMessageBus = new MessageBus()
sceneMessageBus.on('UpdateLeaderboard', () => {
	console.log('sceneMessageBus: UpdateLeaderboard')
	leaderboardManager.UpdateResults()
})
