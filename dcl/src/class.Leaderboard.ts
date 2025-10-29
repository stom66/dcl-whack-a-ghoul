export class Leaderboard {
	private apiUrl: string = 'https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api'

	constructor() {}

	public async submitScore(username: string, score: number): Promise<boolean> {
		try {
			const response = await fetch(`${this.apiUrl}/submitScore`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, score })
			})
			return response.ok
		} catch (error) {
			console.error('Error submitting score:', error)
			return false
		}
	}

	public async getLeaderboard(): Promise<{ username: string; score: number }[]> {
		try {
			const response = await fetch(`${this.apiUrl}/getLeaderboard`)
			if (!response.ok) throw new Error('Failed to fetch leaderboard')
			return await response.json()
		} catch (error) {
			console.error('Error fetching leaderboard:', error)
			return []
		}
	}
}

export const _Leaderboard = new Leaderboard()
