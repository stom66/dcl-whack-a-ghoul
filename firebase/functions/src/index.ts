import { onRequest } from "firebase-functions/v2/https";

import express from "express";
import cors from "cors";
import * as logger from "firebase-functions/logger";
require("firebase-functions/logger/compat");

import * as admin from "firebase-admin";
// import { user } from "firebase-functions/v1/auth";

// Some custom settings
const RESULT_LIMIT: number = 10;
const MAX_SCORE: number = 250;

// Initialize Firebase Admin SDK (needed for database access)
admin.initializeApp();
const db = admin.firestore();

// Create an Express app to handle API requests
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Submit a score to the leaderboard
app.post("/submitScore", async (req, res) => {
	try {
		const { username, score } = req.body;
		if (!username || typeof score !== "number") {
			return res.status(400).send("Invalid data format");
		}

		if (score > MAX_SCORE) {
			return res
				.status(429)
				.send(
					"Please try again soon, your score is very important to us, and we are experiencing an unusually high volume of scores at this time. Please keep trying."
				);
		}

		const bannedWords = ["BWC","ahole","anus","ash0le","ash0les","asholes","ass","Ass Monkey","Assface","assh0le","assh0lez","asshole","assholes","assholz","asswipe","azzhole","bassterds","bastard","bastards","bastardz","basterds","basterdz","Biatch","bitch","bitches","Blow Job","boffing","butthole","buttwipe","c0ck","c0cks","c0k","Carpet Muncher","cawk","cawks","Clit","cnts","cntz","cock","cockhead","cock-head","cocks","CockSucker","cock-sucker","crap","cum","cunt","cunts","cuntz","dick","dild0","dild0s","dildo","dildos","dilld0","dilld0s","dominatricks","dominatrics","dominatrix","dyke","enema","f u c k","f u c k e r","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","fart","flipping the bird","fuck","fucker","fuckin","fucking","fucks","Fudge Packer","fuk","Fukah","Fuken","fuker","Fukin","Fukk","Fukkah","Fukken","Fukker","Fukkin","g00k","God-damned","h00r","h0ar","h0re","hells","hoar","hoor","hoore","jackoff","jap","japs","jerk-off","jisim","jiss","jizm","jizz","knob","knobs","knobz","kunt","kunts","kuntz","Lezzian","Lipshits","Lipshitz","masochist","masokist","massterbait","masstrbait","masstrbate","masterbaiter","masterbate","masterbates","Motha Fucker","Motha Fuker","Motha Fukkah","Motha Fukker","Mother Fucker","Mother Fukah","Mother Fuker","Mother Fukkah","Mother Fukker","mother-fucker","Mutha Fucker","Mutha Fukah","Mutha Fuker","Mutha Fukkah","Mutha Fukker","n1gr","nastt","nigger;","nigur;","niiger;","niigr;","orafis","orgasim;","orgasm","orgasum","oriface","orifice","orifiss","packi","packie","packy","paki","pakie","paky","pecker","peeenus","peeenusss","peenus","peinus","pen1s","penas","penis","penis-breath","penus","penuus","Phuc","Phuck","Phuk","Phuker","Phukker","polac","polack","polak","Poonani","pr1c","pr1ck","pr1k","pusse","pussee","pussy","puuke","puuker","recktum","rectum","retard","sadist","scank","schlong","screwing","semen","sex","sexy","Sh!t","sh1t","sh1ter","sh1ts","sh1tter","sh1tz","shit","shits","shitter","Shitty","Shity","shitz","Shyt","Shyte","Shytty","Shyty","skanck","skank","skankee","skankey","skanks","Skanky","slag","slut","sluts","Slutty","slutz","son-of-a-bitch","tit","turd","va1jina","vag1na","vagiina","vagina","vaj1na","vajina","vullva","vulva","w0p","wh00r","wh0re","whore","xrated","xxx","b!+ch","bitch","blowjob","clit","arschloch","fuck","shit","ass","asshole","b!tch","b17ch","b1tch","bastard","bi+ch","boiolas","buceta","c0ck","cawk","chink","cipa","clits","cock","cum","cunt","dildo","dirsa","ejakulate","fatass","fcuk","fuk","fux0r","hoer","hore","jism","kawk","l3itch","l3i+ch","masturbate","masterbat*","masterbat3","motherfucker","s.o.b.","mofo","nazi","nigga","nigger","nutsack","phuck","pimpis","pusse","pussy","scrotum","sh!t","shemale","shi+","sh!+","slut","smut","teets","tits","boobs","b00bs","teez","testical","testicle","titt","w00se","jackoff","wank","whoar","whore","*damn","*dyke","*fuck*","*shit*","@$$","amcik","andskota","arse*","assrammer","ayir","bi7ch","bitch*","bollock*","breasts","butt-pirate","cabron","cazzo","chraa","chuj","Cock*","cunt*","d4mn","daygo","dego","dick*","dike*","dupa","dziwka","ejackulate","Ekrem*","Ekto","enculer","faen","fag*","fanculo","fanny","feces","feg","Felcher","ficken","fitt*","Flikker","foreskin","Fotze","Fu(*","fuk*","futkretzn","gook","guiena","h0r","h4x0r","hell","helvete","hoer*","honkey","Huevon","hui","injun","jizz","kanker*","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi*","kyrpa*","lesbo","mamhoon","masturbat*","merd*","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger*","orospu","paska*","perse","picka","pierdol*","pillu*","pimmel","piss*","pizda","poontsee","poop","porn","p0rn","pr0n","preteen","pula","pule","puta","puto","qahbeh","queef*","rautenberg","schaffer","scheiss*","schlampe","schmuck","screw","sh!t*","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","splooge","suka","b00b*","testicle*","titt*","twat","vittu","wank*","wetback*","wichser","wop*","yed","zabourah"];

		if (bannedWords.some((word) => username.includes(word))) {
			console.log("Username contains a banned word: ", username);
			return res.status(400).send("Invalid data sent: bwc");
		}

		// Add the entry to the leaderboard
		const entry = {
			username,
			score,
			timestamp: Date.now(),
		};
		await db.collection("leaderboard").add(entry);

		// Build the new top10 leaderboard
		const snapshot = await db
			.collection("leaderboard")
			.orderBy("score", "desc")
			.get();

		// Create a blank map to store unique scores in
		const leaderboardMap = new Map<string, any>();

		// Loop through all the returned docs
		for (const doc of snapshot.docs) {
			const data = doc.data();

			if (!data.username) continue; // Skip if username is missing
			const username = String(data.username).trim().toLowerCase(); // Ensure username is lowercase, trimmed

			// Ensure we don't already have an entry in the map for it
			if (!leaderboardMap.has(username)) {
				console.log(
					"Username not found in results, adding username:",
					username
				);
				leaderboardMap.set(username, data);
			} else {
				console.log(
					"Username already exists in results, skipping username:",
					username
				);
			}

			// Break if we hit our result limit early
			if (leaderboardMap.size >= RESULT_LIMIT) {
				console.log(
					"Breaking early as we already have 10 unique usernames",
					username
				);
				break; // Stop once we have 10 unique users
			}
		}
		// Convert the map to an array
		const leaderboard = Array.from(leaderboardMap.values());

		// First, clear out existing top10 collection
		const top10Ref = db.collection("top10");
		const top10Snapshot = await top10Ref.get();
		const batch = db.batch();

		top10Snapshot.forEach((doc) => {
			batch.delete(doc.ref);
		});

		// Commit deletion
		await batch.commit();

		// Now add new top 10 entries
		const newBatch = db.batch();

		leaderboard.forEach((entry, index) => {
			const docRef = top10Ref.doc(); // Or use `.doc(entry.username)` if you want deterministic IDs
			newBatch.set(docRef, {
				...entry,
				rank: index + 1,
			});
		});

		await newBatch.commit();

		return res.status(200).send("Score submitted successfully");
	} catch (error) {
		logger.error("Error submitting score", error);
		return res.status(500).send("Error submitting score");
	}
});

// Fetch leaderboard scores (top 10 unique users, highest score per user)
app.get("/getLeaderboard", async (req, res) => {
	try {
		const snapshot = await db.collection("top10").orderBy("rank", "asc").get();

		const leaderboard = snapshot.docs.map((doc) => doc.data());

		return res.status(200).json(leaderboard);
	} catch (error) {
		logger.error("Error retrieving leaderboard", error);
		return res.status(500).send("Error retrieving leaderboard");
	}
});

// Export the API using Firebase Functions
export const api = onRequest(app);
