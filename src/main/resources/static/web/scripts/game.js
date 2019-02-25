var app = new Vue({
	el: "#app",
	data: {
		allData: [],
		gamePlayerId: [],
		columns: [],
		rows: [],
		ships: [],
		game: [],
		players: [],
		salvoes: [],
		opponentSalvoes: [],
		//		shipTypes: ["Aircraft Carrier", "Battleship", "Submarine", "Destroyer", "Patrol Boat"],
		placedShips: [],
		nonPlacedShips: [],
		shipLocsToBeSubmitted: [],

		shipList: [
			{
				type: "Aircraft Carrier",
				locations: [],
				length: 5
			}, {
				type: "Battleship",
				locations: [],
				length: 4
			}, {
				type: "Submarine",
				locations: [],
				length: 3
			}, {
				type: "Destroyer",
				locations: [],
				length: 3
			}, {
				type: "Patrol Boat",
				locations: [],
				length: 2
			}
		],
		currentDraggingShip: [],

	},
	methods: {
		getData: function () {
			fetch("/api/game_view/" + this.paramObj(location.search), {
					method: "GET"
				})
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					console.log(json);
					app.allData = json;
					app.ships = json.ships;
					app.game = json.game;
					app.players = app.game.gamePlayers;
					app.gamePlayerId = json.gameplayer_id;
					app.salvoes = json.salvoes;
					app.opponentSalvoes = json.opponent_salvoes;

					app.addShip();
					app.addSalvo();
					app.addOpp_Salvo();
					app.listShips();



				}).catch(function (error) {
					console.log(error)
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
				if (r.status == 200) console.log(r);
				location.href = "games.html";
			}).catch(e => console.log(e))
		},
		createGrid: function () {
			for (var i = 0; i < 10; i++) {
				this.columns.push(1 + i);
			}
			for (var i = 0; i < 10; i++) {
				this.rows.push(String.fromCharCode(65 + i));
			}
		},
		paramObj: function (search) {
			var obj = {};
			var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;
			search.replace(reg, function (match, param, val) {
				obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
			});
			//			console.log(obj.gp)
			return obj.gp;

		},
		addShip: function () {
			console.log(this.ships)
			for (var i = 0; i < this.ships.length; i++) {
				var locations = this.ships[i].locations;

				for (var j = 0; j < locations.length; j++) {
					var shipLocation = document.getElementById(locations[j]);
					shipLocation.setAttribute("class", "ship");
					//					if(this.ships[i].type == "Patrol Boat"){
					//					   shipLocation.setAttribute("id", "ship_Pat");
					//					   }
				}
			}
		},
		addSalvo: function () {
			for (var i = 0; i < this.salvoes.length; i++) {
				var locs = this.salvoes[i].locations;
				var turn = this.salvoes[i].turn;
				for (var j = 0; j < locs.length; j++) {
					var salvoLocation = document.getElementById("salvo" + locs[j]);
					salvoLocation.setAttribute("class", "salvo");
					var writeTurn = document.createElement("span");
					writeTurn.append(turn);
					salvoLocation.append(writeTurn);

				}
			}
		},
		addOpp_Salvo: function () {
			for (var i = 0; i < this.opponentSalvoes.length; i++) {
				var locs = this.opponentSalvoes[i].locations;
				var turn = this.opponentSalvoes[i].turn;
				for (var j = 0; j < locs.length; j++) {
					var opp_SalvoLocation = document.getElementById(locs[j]);
					if (opp_SalvoLocation.hasAttribute("class", "ship")) {
						opp_SalvoLocation.setAttribute("class", "opp_salvo_hit");
					} else {
						opp_SalvoLocation.setAttribute("class", "opp_salvo");
					}
					var writeTurn = document.createElement("span");
					writeTurn.append(turn);
					opp_SalvoLocation.append(writeTurn);
				}
			}
		},
		placeShip: function () {
			fetch("/api/games/player/" + this.gamePlayerId + "/ships", {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify([{
						type: type,
						locations: locations
									}]),
					//															body: JSON.stringify([{
					//																type: "Destroyer",
					//																locations: ["A1","A2","A3"]
					//																		}]),

				}).then(r => {
					console.log(r);
					return r.json();
				}).then(json => {
					console.log(json);
				})
				.catch(e => console.log(e))
		},
		listShips: function () {
			var newLi = [];
			for (var i = 0; i < app.ships.length; i++) {
				app.placedShips.push(app.ships[i].type);
			}
			for (var i = 0; i < app.shipList.length; i++) {
				newLi.push(app.shipList[i].type);

				app.nonPlacedShips = newLi.filter(function (val) {
					return app.placedShips.indexOf(val) == -1;
				});
			}
			console.log(newLi)
		},
		draggable: function (e) {
			var shipId = e.target.id;
			$("#" + shipId).draggable({
				revert: "invalid",
				snap: ".ui-droppable",
				snapMode: "inner",
				snapTolerance: 20,
				start: function (e, ui) {
					app.currentDraggingShip = $(this).html();
				}
			});

			$('#droppable td[id]').droppable({
					drop: function (e, ui) {
						console.log("hre", e.target.id)
						var theClass = $(this).attr('id');
						console.log($(this))
						var row = theClass.slice(0, 1);
						//					console.log(theClass);
						if (theClass.length == 2) {
							var column = theClass.slice(1, 2);
							var parseColumn = parseInt(column);
						} else {
							var column = theClass.slice(1, 3);
							var parseColumn = parseInt(column);
						}
						for (var i = 0; i < app.shipList.length; i++) {
							if (app.currentDraggingShip == app.shipList[i].type) {
								var shipLength = app.shipList[i].length;
								if (shipLength == 2) {
									var shipPlace = row + parseColumn;
									var shipPlace1 = row + (parseColumn + 1);
									console.log(shipPlace, shipPlace1);
								} else if (shipLength == 5) {
									for (var j = 0; j < shipLength; j++) {
										var shipPlace = row + (parseColumn - j + 2);
										console.log(shipPlace);
									}
								} else {
									for (var j = 0; j < shipLength; j++) {
									var shipPlace = row + (parseColumn - j + 1);
									console.log(shipPlace);
									}
								}
							}
						}
					}
			});
	},
	rotate: function (e) {
		var shipId = e.target.id;
		$("#" + shipId).toggleClass("rotate");
	},
},
created() {
	this.createGrid();
	this.getData();
},

})
