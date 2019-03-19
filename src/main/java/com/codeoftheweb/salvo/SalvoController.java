package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.reducing;
import static java.util.stream.Collectors.toList;

@RestController

@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PlayerRepository playerRepo;
    @Autowired
    private GamePlayerRepository gamePlayerRepo;
    @Autowired
    private SalvoRepository salvoRepository;
    @Autowired
    private ScoreRepository scoreRepository;
    @Autowired
    private ShipRepository shipRepo;

    @RequestMapping(path = "/games", method = RequestMethod.GET)
    public Map<String, Object> gamesAndCurrentUser(Authentication authentication) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (authentication != null) {
            map.put("player", currentUserDto(authentication));
            map.put("games", getGames());
        } else {
            map.put("games", getGames());
        }
        return map;
    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createPlayer(@RequestParam String userName, String password) {
        if (userName.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepo.findByUserName(userName);
        if (player != null) {
            return new ResponseEntity<>(makeMap("error", "Username already exists"), HttpStatus.CONFLICT);
        } else {
            Player newPlayer = playerRepo.save(new Player(userName, password));
            return new ResponseEntity<>(makeMap("id", newPlayer.getId()), HttpStatus.CREATED);
        }

    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    public List<Object> getGames() {

        return gameRepo.findAll()
                .stream()
                .map(game -> gameDTO(game))
                .collect(toList());
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createNewGame(Authentication authentication) {
        Player currentUser = playerRepo.findByUserName(authentication.getName());
        if (currentUser != null) {
            LocalDateTime date = LocalDateTime.now();
            Game game = new Game(date);
            gameRepo.save(game);
            GamePlayer gamePlayer = new GamePlayer(currentUser, game);
            gamePlayerRepo.save(gamePlayer);
            return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(path = "/game/{id}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long id, Authentication authentication) {
        Game game = gameRepo.findOne(id);
        Player currentUser = playerRepo.findByUserName(authentication.getName());
        LocalDateTime date = LocalDateTime.now();
        if (currentUser == null) {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        } else if (game == null) {
            return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
        } else if (game.getGamePlayers().size() == 2) {
            return new ResponseEntity<>(makeMap("error", "Game is full"), HttpStatus.FORBIDDEN);
        } else {
            gameRepo.save(game);
            GamePlayer gamePlayer = new GamePlayer(currentUser, game);
            gamePlayerRepo.save(gamePlayer);
            return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);
        }
    }

    @RequestMapping(path = "/games/player/{gamePlayerId}/ships", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> getShips(@PathVariable Long gamePlayerId,
                                                        Authentication authentication,
                                                        @RequestBody List<Ship> shipList) {

        Player currentUser = playerRepo.findByUserName(authentication.getName());
        GamePlayer gamePlayer = gamePlayerRepo.findOne(gamePlayerId);
        Player playerOfTheGamePlayer = gamePlayer.getPlayer();
        if (currentUser == null) {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        } else if (gamePlayer.getPlayer().getUserName() != authentication.getName()) {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        } else if (gamePlayer.getShips().size() > 0) {
            return new ResponseEntity<>(makeMap("error", "Ships already placed"), HttpStatus.FORBIDDEN);
        } else if (currentUser.getId() != playerOfTheGamePlayer.getId()) {
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.CONFLICT);
        } else {
            shipList.forEach(ship -> {
                gamePlayer.addShip(ship);
                shipRepo.save(ship);

            });
            return new ResponseEntity<>(makeMap("success", "Ships located"), HttpStatus.CREATED);
        }


    }

    @RequestMapping(path = "/games/player/{gamePlayerId}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> getSalvos(@PathVariable Long gamePlayerId,
                                                         Authentication authentication,
                                                         @RequestBody List<Salvo> salvoList) {

        Player currentUser = playerRepo.findByUserName(authentication.getName());
        GamePlayer gamePlayer = gamePlayerRepo.findOne(gamePlayerId);
        Player playerOfTheGamePlayer = gamePlayer.getPlayer();
        if (currentUser == null) {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        } else if (gamePlayer.getPlayer().getUserName() != authentication.getName()) {
            return new ResponseEntity<>(makeMap("error", "No user found"), HttpStatus.UNAUTHORIZED);
        } else if (currentUser.getId() != playerOfTheGamePlayer.getId()) {
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.CONFLICT);
        } else {
            salvoList.forEach(salvo -> {
                gamePlayer.addSalvo(salvo);
                salvoRepository.save(salvo);

            });
            return new ResponseEntity<>(makeMap("success", "Salvos located"), HttpStatus.CREATED);
        }


    }

    //이 파트는 리스트를 얻는것.
    //여기서 gameplayerrepo쓴거는 gameplayer 누군지 모르니까 gameplayerrepo 중에 하나만 고르기위해.

    @RequestMapping(path = "/game_view/{id}", method = RequestMethod.GET)
    public Object gameViewDTO(@PathVariable Long id, Authentication authentication) {
        GamePlayer gamePlayer = gamePlayerRepo.findOne(id);
        if (authentication.getName() != gamePlayer.getPlayer().getUserName()) {
            return new ResponseEntity<>(makeMap("error", "Wrong user"), HttpStatus.UNAUTHORIZED);

        } else {
            return new LinkedHashMap<String, Object>() {
                {
                    GamePlayer opponent = getOpponent(gamePlayer);

                    getSunkShip(gamePlayer);
                    put("gameplayer_id", gamePlayer.getId());

                    put("game", gameDTO(gamePlayer.getGame()));
                    put("ships", gamePlayer.getShips()
                            .stream()
                            .map(ship -> shipDTO(ship))//inside map do something
                            .collect(toList()));
                    put("salvos", gamePlayer.getSalvos()
                            .stream()
                            .map(salvo -> salvoDTO(salvo))
                            .collect(toList()));
put("gameOver", isGameOver(gamePlayer));
put("score", calcScore(gamePlayer));

                    if (opponent != null) {
                        put("myTurn", isMyTurn(gamePlayer));
                        put("opponent_salvos", opponent.getSalvos()
                                .stream()
                                .map(salvo -> salvoDTO(salvo))
                                .collect(toList()));
                        put("user_hits", allHitLocations(gamePlayer));
                        put("opponent_hits", allHitLocations(opponent));
                        put("user_sunk_ships", finalSunkShip(gamePlayer));
                        put("opponent_sunk_ships", finalSunkShip(opponent));
                    }
                }
            };
        }
    }
    private GamePlayer getOpponent(GamePlayer gamePlayer) {
        GamePlayer opponent = null;
        for (GamePlayer gp : gamePlayer.getGame().getGamePlayers()) {
            if (gp.getId() != gamePlayer.getId())
                opponent = gp;
        }
        return opponent;
    }
    private List<String> allSalvoLocations(GamePlayer gamePlayer) {
        List<String> salvos = new ArrayList<>();
        for (Salvo salvo : gamePlayer.getSalvos()) {
            for (String location : salvo.getLocations()) {
                salvos.add(location);
            }
        }
        return salvos;
    }

    private List<String> allShipLocations(GamePlayer gamePlayer) {
        List<String> ships = new ArrayList<>();
        for (Ship ship : gamePlayer.getShips()) {
            for (String location : ship.getLocations()) {
                ships.add(location);
            }
        }
        return ships;
    }

    private List<String> allHitLocations(GamePlayer gamePlayer) {
        List<String> allShips = allShipLocations(getOpponent(gamePlayer));
        List<String> allSalvos = allSalvoLocations(gamePlayer);
        List<String> hits = new ArrayList<>();
        for (String location : allShips) {
            if (allSalvos.contains(location))
                hits.add(location);
        }
        return hits;
    }

    private boolean shipSunk(List<String> salvoLocations, Ship ship) {
        boolean shipSunk = ship.getLocations().stream().allMatch(locations -> salvoLocations.contains(locations));
        if (shipSunk) {
            ship.setSunk(true);
            shipRepo.save(ship);
        }
        return shipSunk;
    }

    private void getSunkShip(GamePlayer gamePlayer) {
        GamePlayer opponent = getOpponent(gamePlayer);
        Set<Ship> opponentShip = opponent.getShips();
        List<String> playerSalvos = allSalvoLocations(gamePlayer);
        opponentShip.stream()
                .filter(ship -> !ship.isSunk())
                .forEach(ship -> {
                    shipSunk(playerSalvos, ship);
                });
    }

    private List<Object> finalSunkShip(GamePlayer gamePlayer) {
        List<Object> finalSunk = new ArrayList<>();
        Set<Ship> gamePlayerShips = gamePlayer.getShips();
        for (Ship gamePlayerShip : gamePlayerShips) {
            if (gamePlayerShip.isSunk()) {
                finalSunk.add(shipDTO(gamePlayerShip));
            }
        }
        return finalSunk;
    }

    private Integer getLastTurn(GamePlayer gamePlayer) {
//        Set<Salvo> gamePlayerSalvos = gamePlayer.getSalvos();
        Integer lastTurn = 0;
        for (Salvo salvo : gamePlayer.getSalvos()) {
            Integer turn = salvo.getTurn();
            if (turn > lastTurn) {
                lastTurn = turn;
            }
        }
        return lastTurn + 1;
    }

    private boolean isMyTurn(GamePlayer gamePlayer) {
        boolean isMyturn;
        GamePlayer opponent = getOpponent(gamePlayer);
        Integer playerTurn = getLastTurn(gamePlayer);
        Integer opponentTurn = getLastTurn(opponent);

        if (opponentTurn > playerTurn) {
            isMyturn = true;
        } else if (opponentTurn < playerTurn) {
            isMyturn = false;
        }
        else {
            if (opponent.getId() > gamePlayer.getId()) {
                isMyturn = true;
            } else {
                isMyturn = false;
            }
        }
        return isMyturn;
    }
    private boolean isGameOver(GamePlayer gamePlayer) {
        if(finalSunkShip(gamePlayer).size() == 5 || finalSunkShip(getOpponent(gamePlayer)).size() == 5){
            if(getLastTurn(gamePlayer) == getLastTurn(getOpponent(gamePlayer))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private Double calcScore(GamePlayer gamePlayer) {
        Double score = null;
        if (isGameOver(gamePlayer)) {
            if (finalSunkShip(gamePlayer).size() == 5 && finalSunkShip(getOpponent(gamePlayer)).size() != 5) {
                scoreRepository.save(new Score(gamePlayer.getGame(), gamePlayer.getPlayer(), 0.0));

                score = 0.0;
            }
            if (finalSunkShip(getOpponent(gamePlayer)).size() == 5 && finalSunkShip(gamePlayer).size() != 5) {
                scoreRepository.save(new Score(gamePlayer.getGame(), gamePlayer.getPlayer(), 1.0));
                score = 1.0;
            }
            if (finalSunkShip(getOpponent(gamePlayer)).size() == 5 && finalSunkShip(gamePlayer).size() == finalSunkShip(getOpponent(gamePlayer)).size()) {
                scoreRepository.save(new Score(gamePlayer.getGame(), gamePlayer.getPlayer(), 0.5));
                score = 0.5;
            }
        }
    return score;
    }







    ///////////////////// DTOs



    public Map<String, Object> gameDTO(Game game) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", game.getId());
        map.put("date", game.getCreationDate());
        map.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gamePlayer -> gamePlayerDTO(gamePlayer))
                .collect(toList()));
        return map;
    }

    public Map<String, Object> playerDTO(Player player) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", player.getId());
        map.put("username", player.getUserName());
        return map;
    }

    public Map<String, Object> gamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", gamePlayer.getId());
        map.put("player", playerDTO(gamePlayer.getPlayer()));
        if (gamePlayer.getScore() != null) {
            map.put("score", gamePlayer.getScore().getScore());
        }
        return map;
    }

    //DTO 파트는 하나의 ship만 찾는것,
    // type and locations for one ship

    public Map<String, Object> shipDTO(Ship ship) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("type", ship.getType());
        map.put("locations", ship.getLocations());
        return map;
    }

    private Map<String, Object> salvoDTO(Salvo salvo) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("gameplayer_id", salvo.getGamePlayer().getId());
        map.put("locations", salvo.getLocations());
        map.put("turn", salvo.getTurn());
        return map;
    }

    public Map<String, Object> scoreDTO(Score score) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("game", score.getGame());
        map.put("player", score.getPlayer());
        map.put("score", score.getScore());
        return map;
    }

    public Map<String, Object> currentUserDto(Authentication authentication) {
        Map<String, Object> current = new LinkedHashMap<>();

        Player player = playerRepo.findByUserName(authentication.getName());
        return playerDTO(player);
    }


}