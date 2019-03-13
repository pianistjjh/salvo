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
		salvos: [],
		opponentsalvos: [],
		placedShips: [],
		nonPlacedShips: [],

		currentDraggingShip: [],

		//		currentLocation: '',
		shipTarget: '',
		cellTarget: '',
		locationValid: true,
		overlappingValid: true,
		restShips: [],
		selectedShip: [],
		previusSelectedShip: {},
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
		shipListToBeSent: [],

		object: {},
		//		allPositionArray: [],
		shipsAllPlaced: [],
		shipSubmitBtn: false,
		salvoSubmitBtn: false,
		salvoLocation: [{
			locations: [],
			turn: 0
		}],
		//		allShipLocations: [],
		//		allSalvoLocations: [],
		//		allHitLocations: [],


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
					app.salvos = json.salvos;
					app.opponentsalvos = json.opponent_salvos;

					app.addShip();
					app.addSalvo();
					app.addOpp_Salvo();
					app.listShips();
					//					app.getAllLocations();

					var hits = app.allData.user_hits;
					for (var i = 0; i < hits.length; i++) {
						hits[i] = "salvo" + hits[i];
						var ss = document.getElementById(hits[i]);
						document.getElementById(hits[i]).setAttribute("class", "opp_salvo_hit");

					}



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

				}
			}
		},
		addSalvo: function () {
			for (var i = 0; i < this.salvos.length; i++) {
				var locs = this.salvos[i].locations;
				var turn = this.salvos[i].turn;
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

			for (var i = 0; i < this.opponentsalvos.length; i++) {
				var locs = this.opponentsalvos[i].locations;
				var turn = this.opponentsalvos[i].turn;
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
					body: JSON.stringify(
						app.shipList
					),
				}).then(r => {
					console.log(r);
					return r.json();
				}).then(json => {
					console.log(json);
				})
				.catch(e => console.log(e))
		},
		placeSalvo: function () {
			console.log("Hello")
			fetch("/api/games/player/" + this.gamePlayerId + "/salvos", {
					credentials: 'include',
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(
						app.salvoLocation

					),
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
			var thisShip = e.target;
			app.shipTarget = thisShip;
			var shipId = e.target.id;
			$("#" + shipId).draggable({
				start: function (e, ui) {
					app.currentDraggingShip = $(this).html();
					app.locationValid = true;
					app.overlappingValid = true;

				},
				revert: function () {
					if (!app.locationValid) {
						app.location();

					}

					return app.locationValid;

				},
				snap: ".ui-droppable",
				snapMode: "inner",
				snapTolerance: 30,
			});

			$('#droppable td[id]').droppable({
				drop: function (e) {

					var cellId = e.target.id;
					app.cellTarget = cellId;

					//					if (!app.locationValid) {
					app.location();
					//					}

					app.range();

				}
			});
		},
		rotate: function (e) {
			var thisShip = app.shipTarget;
			var shipId = thisShip.id;
			var offsetShipLeft = $(thisShip).offset().left;
			var offsetShipRight = offsetShipLeft + $(thisShip).width();
			var offsetShipRightVert = offsetShipLeft + $(thisShip).height();
			var offsetShipTop = $(thisShip).offset().top;
			var offsetShipBtm = offsetShipTop + $(thisShip).height();
			var offsetShipBtmVert = offsetShipTop + $(thisShip).width();

			var tbody = $(".tableWrap:first-child tbody");

			var offsetGridLeft = tbody.offset().left + $("tbody tr:first-child th:first-child").width();
			var offsetGridRight = tbody.offset().left + tbody.width();
			var offsetGridTop = tbody.offset().top + $("tbody tr:first-child").height();
			var offsetGridBtm = tbody.offset().top + tbody.height();

			if ($("#" + shipId).hasClass("rotate")) {
				if (offsetShipLeft >= offsetGridLeft && offsetShipRight <= offsetGridRight && offsetShipTop >= offsetGridTop && offsetShipBtm <= offsetGridBtm) {
					$("#" + shipId).removeClass("rotate");
				} else {
					console.log("unable to rotate")
				}
			} else {
				if (offsetShipLeft >= offsetGridLeft && offsetShipRightVert <= offsetGridRight && offsetShipTop >= offsetGridTop && offsetShipBtmVert <= offsetGridBtm) {
					$("#" + shipId).addClass("rotate");
				} else {
					console.log("unable to rotate")
				}
			}
			app.range();
			app.location();
		},
		range: function () {
			app.locationValid = true;
			console.log(app.locationValid)
			var thisShip = app.shipTarget;
			var shipId = thisShip.id;

			var cellId = app.cellTarget.id;
			var offsetShipLeft = $(thisShip).offset().left;
			var offsetShipRight = offsetShipLeft + $(thisShip).width();
			var offsetShipRightVert = offsetShipLeft + $(thisShip).height();
			var offsetShipTop = $(thisShip).offset().top;
			var offsetShipBtm = offsetShipTop + $(thisShip).height();
			var offsetShipBtmVert = offsetShipTop + $(thisShip).width();
			var tbody = $(".tableWrap:first-child tbody");
			var offsetGridLeft = tbody.offset().left + $("tbody tr:first-child th:first-child").width();
			var offsetGridRight = tbody.offset().left + tbody.width();
			var offsetGridTop = tbody.offset().top + $("tbody tr:first-child").height();
			var offsetGridBtm = tbody.offset().top + tbody.height();

			if (!$("#" + shipId).hasClass("rotate")) {
				if (!(offsetShipLeft >= offsetGridLeft && offsetShipRight <= offsetGridRight && offsetShipTop >= offsetGridTop && offsetShipBtm <= offsetGridBtm)) {
					app.locationValid = true;
				} else {
					app.locationValid = false;
				}
			} else {
				if (!(offsetShipLeft >= offsetGridLeft && offsetShipRightVert <= offsetGridRight && offsetShipTop >= offsetGridTop && offsetShipBtmVert <= offsetGridBtm)) {
					app.locationValid = true;
				} else {
					app.locationValid = false;
				}
			}
		},
		location: function () {
			var thisShip = app.shipTarget;
			var shipId = thisShip.id;
			var cellId = app.cellTarget;
			var row = cellId.slice(0, 1);
			var shipPlace = [];

			if (cellId.length == 2) {
				var column = cellId.slice(1, 2);
			} else {
				var column = cellId.slice(1, 3);
			}
			var parseColumn = parseInt(column);

			let readed = false;
			for (var i = 0; i < app.shipList.length; i++) {

				var shipLength = app.shipList[i].length;
				var indexRow = app.rows.indexOf(row);

				if (!$("#" + shipId).hasClass("rotate")) {
					if (app.currentDraggingShip == app.shipList[i].type) {
						for (var j = 0; j < shipLength; j++) {
							if (shipLength == 2) {
								shipPlace.push(row + (parseColumn + j));
							} else if (shipLength == 5 || shipLength == 4) {
								shipPlace.push(row + (parseColumn - j + 2));
							} else {
								shipPlace.push(row + (parseColumn - j + 1));
							}
							if (!app.locationValid) {
								app.shipList[i].locations = [];
								app.shipList[i].locations = shipPlace;
							}
						}
						console.log(app.shipList[i].locations);
					}
				} else {
					if (app.currentDraggingShip == app.shipList[i].type) {
						for (var j = 0; j < shipLength; j++) {
							if (shipLength == 2) {
								shipPlace.push(app.rows[indexRow + j] + parseColumn);
							} else if (shipLength == 5) {
								shipPlace.push(app.rows[indexRow + j] + (parseColumn - 2));
							} else {
								shipPlace.push(app.rows[indexRow + j] + (parseColumn - 1));
							}
							if (!app.locationValid) {
								app.shipList[i].locations = [];
								app.shipList[i].locations = shipPlace;

							}
						}
						console.log(app.shipList[i].locations);
					}

				}
			}
			app.shipsAllPlaced = [];

			for (var i = 0; i < app.shipList.length; i++) {
				if (app.shipList[i].locations.length == 0) {
					app.shipsAllPlaced.push(app.shipList[i].type);
				}

			}
			app.isOverlapping();
			app.shipSubmitBtn = false;
			if (app.shipsAllPlaced.length !== 0) {
				app.shipSubmitBtn = false;
			} else {
				app.shipSubmitBtn = true;
			}
		},
		isOverlapping: function () {
			app.locationValid = true;
			app.selectedShip = app.shipList.filter(ship => ship.type == app.currentDraggingShip)[0];
			let object = {};
			app.restShips = [...app.restShips, ...app.selectedShip.locations]
			if (!app.object[app.selectedShip.type]) {
				app.object[app.selectedShip.type] = app.selectedShip.locations;

			} else {
				app.object[app.selectedShip.type].forEach((el) => {
					let index = app.restShips.indexOf(el);
					app.restShips.splice(index, 1);
				})
				app.object[app.selectedShip.type] = app.selectedShip.locations;
			}
			let uniques = [];
			let duplicates = [];
			app.restShips.forEach(el => {
				if (!uniques.includes(el))
					uniques.push(el)
				else
					duplicates.push(el)
			});

			let arrayToRemove = [...duplicates];
			arrayToRemove.forEach(el => {
				let index = app.restShips.indexOf(el);
				app.restShips.splice(index, 1)
			})

			if (duplicates.length == 0) {
				app.locationValid = false;
				let index = app.shipList.indexOf(app.selectedShip)
				app.shipList[index].locations = app.selectedShip.locations;

			} else {
				console.log(true, "invalid position")
				app.locationValid = true;
				let index = app.shipList.indexOf(app.selectedShip)
				if (app.shipList[index].locations.length > 0)
					app.restShips = [...app.restShips, ...app.shipList[index].locations];
			}

		},
		checkToPlaceShip: function () {
			app.placeShip();
			location.reload();
		},
		checkToPlaceSalvo: function () {
			//			console.log(app.salvoLocation[0])
			//			console.log(app.salvoLocation[0].locations.length)

			if (app.salvoLocation[0].locations.length == 3) {
				app.placeSalvo();
				location.reload();


				//			console.log(hits)
			} else {
				alert("You need to select 3 locations to submit!");
			}
		},
		fireSalvo: function (cellId) {

			app.salvoSubmitBtn = false;
			var location = cellId.slice(5);
			if (!$('#' + cellId).hasClass("salvo")) {
				if (!($('#' + cellId).hasClass("salvoThisTurn"))) {
					if (app.salvoLocation[0].locations.length >= 3) {
						alert("You've already placed 3 salvos");
					} else {
						$('#' + cellId).addClass("salvoThisTurn");
						app.salvoLocation[0].locations.push(location);
					}
				} else {
					$('#' + cellId).removeClass("salvoThisTurn");
					let index = app.salvoLocation[0].locations.indexOf(location)
					app.salvoLocation[0].locations.splice(index, 1);
				}
			} else {
				alert("You cannot fire salvo here!")
			}
			if (app.salvoLocation[0].locations.length == 3) {
				app.salvoSubmitBtn = true;
			} else {
				app.salvoSubmitBtn = false;
			}
			//			console.log(app.salvoLocation);
			//			app.allSalvoLocations = [];
			//			app.getAllLocations();

		},
		//		getAllLocations: function () {
		//			//get All Ships locations
		//			console.log(app.ships)
		//			if (app.allShipLocations.length != 17) {
		//				for (var i = 0; i < app.ships.length; i++) {
		//					for (var j = 0; j < app.ships[i].locations.length; j++) {
		//						app.allShipLocations.push(app.ships[i].locations[j])
		//					}
		//				}
		//			}
		//			//get All Salvos locations(salvos shoot by opponent)
		//			for (var i = 0; i < app.opponentsalvos.length; i++) {
		//				for (var j = 0; j < app.opponentsalvos[i].locations.length; j++) {
		//					app.allSalvoLocations.push(app.opponentsalvos[i].locations[j]);
		//				}
		//			}
		//
		//			//get All hits locations
		//			app.allHitLocations = app.allShipLocations.filter(function (val) {
		//				return app.allSalvoLocations.indexOf(val) != -1
		//			});
		//
		//			console.log(app.allSalvoLocations);
		//			console.log(app.allShipLocations);
		//			console.log(app.allHitLocations)
		//		},
	},
	created() {
		this.createGrid();
		this.getData();


	},

})
