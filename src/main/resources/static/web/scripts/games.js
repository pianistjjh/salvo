var app = new Vue({
	el: "#app",
	data: {
		allGame: [],
		thisPlayer: '',
		players: [],
		forScore: [],
		gamePlayers: [],
		typedUserName: '',
		typedPassword: '',
		errors: [],
		loggedIn: false,
		newGamePlayerId: '',
	},
	methods: {
		getData: function () {
			fetch("/api/games", {
					method: "GET",
					credentials: "include"
				})
				.then(result => {
					//					console.log(result)
					return result.json();
				})
				.then(json => {
					app.allGame = json.games;
					if (json.player != null) {
						app.thisPlayer = json.player;
						console.log(this.allGame)
						this.gameList();
						app.loggedIn = true;
					}
					this.getGamePlayers();
					this.getPlayerNames();
				})
				.catch(error => console.log(error));
		},
		login: function () {
			fetch("/api/login", {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: 'userName=' + this.typedUserName + '&password=' + this.typedPassword,
				})
				.then(r => {
					console.log(r);
					if (r.status == 200) {
						location.reload()
						app.loggedIn = true;
					} else if (r.status == 401) {
						alert("Please Check your User Name / Password");
					}
				})
				.catch(e => {
					console.log(e);
				});
		},
		logout: function () {
			fetch("/api/logout", {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}).then(r => {
				if (r.status == 200) {
					location.reload();
					app.loggedIn = false;
				}
			}).catch(e => console.log(e))
		},
		signup: function () {
			fetch("/api/players", {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: 'userName=' + this.typedUserName + '&password=' + this.typedPassword,
				})
				.then(r => {
					console.log(r.status == 201)
					if (r.status == 201) {
						console.log("succesful!")
						app.login();
					} else if (r.status == 409) {
						alert("User name already exists!")
					} else {
						console.log("Error")
					}
				})
				.catch(e => {
					console.log(e);
				});
		},
		checkForm: function () {
			this.errors = [];
			if (!this.typedUserName) {
				this.errors.push('Email required.');
			} else if (!this.validEmail(this.typedUserName)) {
				this.errors.push('Valid email required.');
			}
			if (!this.typedPassword) this.errors.push("Password required.");
			if (!this.errors.length) {
				app.signup();
				return true;
			}
		},
		validEmail: function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		createGame: function () {
			fetch("/api/games", {
					credentials: 'include',
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.then(result => {
					console.log(result)
					return result.json();
				})
				.then(json => {
					console.log(json)
					app.newGamePlayerId = json.gpid;
					console.log(app.newGamePlayerId);
					location.assign("http://localhost:8080/web/game.html?gp=" + app.newGamePlayerId)
				})
				.catch(function (e) {
					console.log('Request failure: ', e);
					alert(e);
				});
		},
		joinGame: function () {
			var gameId = document.getElementById('joinBtn').dataset.game;
			fetch("/api/game/" + gameId + "/players", {
					credentials: 'include',
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				})
				.then(r => {
					console.log(r);
					return r.json();
				})
				.then(json => {

					app.newGamePlayerId = json.gpid;
					location.assign("http://localhost:8080/web/game.html?gp=" + app.newGamePlayerId);

					console.log(json);
				})
				.catch(function (e) {
					console.log('Request failure: ', e);
					alert("Fail to join the Game. Try again.");
				})
		},
//		placeShip: function () {
//			//			fetch("/api/games/players/" + this.allGame.gamePlayers.player.id + "/ships", {
//			fetch("/api/games/players/16/ships", {
//					credentials: 'include',
//					method: 'POST',
//					headers: {
//						'Accept': 'application/json',
//						'Content-Type': 'application/json'
//					},
//					//					body: JSON.stringify([{
//					//						type: type,
//					//						location: locations
//
//
//					//				}]),
//					body: JSON.stringify([{
//						type: "Destroyer",
//						location: "[“A1”,”A2”,”A2”]"
//								}]),
//					//				body: JSON.stringify([{type: “boat”, location: [“A1”,”A2”,”A2”]}])
//				}).then(r => {
//					console.log(r);
//					return r.json();
//				}).then(json => {
//					console.log(json);
//				})
//				.catch(e => console.log(e))
//		},
		gameList: function () {
			var ol = document.getElementById("gameList");
			for (var i = 0; i < app.allGame.length; i++) {
				for (var j = 0; j < app.allGame[i].gamePlayers.length; j++) {
					var player = app.allGame[i].gamePlayers[j].player;
				}
			}
		},

		getGamePlayers: function () {
			for (x = 0; x < this.allGame.length; x++) {
				for (y = 0; y < this.allGame[x].gamePlayers.length; y++) {
					this.gamePlayers.push(this.allGame[x].gamePlayers[y]);
				}
			}
		},
		getPlayerNames: function () {
			var playerNames = [];
			for (i = 0; i < this.gamePlayers.length; i++) {
				if (!playerNames.includes(this.gamePlayers[i].player.username)) {
					playerNames.push(this.gamePlayers[i].player.username);
				}
			}
			for (j = 0; j < playerNames.length; j++) {
				var player = {
					username: playerNames[j],
					totalScore: 0,
					totalWin: 0,
					totalLoss: 0,
					totalTie: 0,
				}
				for (i = 0; i < this.gamePlayers.length; i++) {
					if (playerNames[j] == this.gamePlayers[i].player.username) {
						if (this.gamePlayers[i].score != null) {
							player.totalScore += this.gamePlayers[i].score;
						}
						if (this.gamePlayers[i].score == 1) {
							player.totalWin++;
						} else if (this.gamePlayers[i].score == 0.5) {
							player.totalTie++;
						} else if (this.gamePlayers[i].score == null) {
							player.totalWin += 0;
							player.totalLoss += 0;
							player.totalTie += 0;
						} else if (this.gamePlayers[i].score == 0) {
							player.totalLoss++;
						}
					}
				}
				app.players.push(player);
				app.players.sort(function (a, b) {
					return b.totalScore - a.totalScore;
				})
			}
		}
	},
	created() {
		this.getData();
	}
})
