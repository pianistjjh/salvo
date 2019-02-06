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
							//					console.log(app.salvoes);
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
					console.log(obj.gp)
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
						console.log(newLi)
						app.nonPlacedShips = newLi.filter(function (val) {
							return app.placedShips.indexOf(val) == -1;
						});
					}
				},
				draggable: function (e) {
					var shipId = e.target.id;

					//			$("#" + shipId).draggable({
					////				snap: ".player",
					////				containment: "#tableWrap",
					////				scroll: false,
					//				revert: "valid"
					//			});
					//			$("#" + shipId).draggable({ revert: "valid" });
					//			$("#" + shipId).droppable({
					//				classes: {
					//					"ui-droppable-active": "ui-state-active",
					//					"ui-droppable-hover": "ui-state-hover"
					//				},
					//				drop: function (event, ui) {
					////					$(this)
					////					 .addClass( "ui-state-highlight" )
					////						.find("table")
					////						.html("Dropped!");
					//					$(this).droppable('destroy');
					//				}
					//				
					//			});

					//						var containmentTop = $("#A1").position().top;
					//						var containmentBottom = $("#J10").position().top + $("#J10").height() - $("#" + shipId).height();
					//						var containmentLeft = $("#A1").position().left;
					//						var containmentRight = $("#J10").position().left + $("#J10").width()  - $("#" + shipId).width();





					$("#" + shipId).draggable({
						revert: "invalid",
						//				containment: [containmentLeft, containmentTop, containmentRight, containmentBottom],
						//				scroll: false
						//				grid: function(){
						//				
						//				}

						//				drag: function () {
						//					var $mouseX = 0,
						//						$mouseY = 0;
						//					var $xp = 0,
						//						$yp = 0;
						//
						//					$(document).mousemove(function (e) {
						//
						//						$mouseX = e.pageX + $(this).width();
						//						$mouseY = e.pageY + $(this).height();
						//					});
						//					console.log($("#" + shipId).width())
						//					console.log($mouseX)
						//					console.log(e.pageX)
						//					$("#" + shipId).css({
						//						left: $mouseX + 'px',
						//						top: $mouseY + 'px'
						//					});
						//				}
					});


					$('#droppable td[id]').droppable({
								drop: function (e, ui) {
									var theClass = $(this).attr('id');
								var row = theClass.slice(0, 1)
								var column = theClass.slice(1, 2)
						
									

									for (var i = 0; i < app.shipList.length; i++) {
										var shipLength = app.shipList[i].length;
										console.log(shipLength)
										if(shipLength == 2){
											var toBeColored = row + (parseInt(column) - 1);
									console.log(toBeColored, theClass)
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
					//		this.paramObj(location.search)
				},

			})
