package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,
									  GameRepository gameRepository,
									  GamePlayerRepository gameplayerRepository,
									  ShipRepository shipRepository,
									  SalvoRepository salvoRepository,
									  ScoreRepository scoreRepository){
		return (args) -> {
			Player playerA = new Player("j.bauer@ctu.gov", "24");
			Player playerB = new Player("c.obrian@ctu.gov", "42");
			Player playerC = new Player("kim_bauer@gmail.com", "kb");
			Player playerD = new Player("t.almeida@ctu.gov", "mole");


			playerRepository.save(playerA);
			playerRepository.save(playerB);
			playerRepository.save(playerC);
			playerRepository.save(playerD);

			LocalDateTime currentTime = LocalDateTime.now();
			Game game1 = new Game(currentTime);
			Game game2 = new Game(currentTime.plusHours(1));
			Game game3 = new Game(currentTime.plusHours(2));
			Game game4 = new Game(currentTime.plusHours(3));
			Game game5 = new Game(currentTime.plusHours(4));
			Game game6 = new Game(currentTime.plusHours(5));
			Game game7 = new Game(currentTime.plusHours(6));
			Game game8 = new Game(currentTime.plusHours(7));
			gameRepository.save(game1);
			gameRepository.save(game2);
			gameRepository.save(game3);
			gameRepository.save(game4);
			gameRepository.save(game5);
			gameRepository.save(game6);
			gameRepository.save(game7);
			gameRepository.save(game8);

			GamePlayer gamePlayer1 = new GamePlayer(playerA, game1);
			GamePlayer gamePlayer2 = new GamePlayer(playerB, game1);
			GamePlayer gamePlayer3 = new GamePlayer(playerA, game2);
			GamePlayer gamePlayer4 = new GamePlayer(playerB, game2);
			GamePlayer gamePlayer5 = new GamePlayer(playerB, game3);
			GamePlayer gamePlayer6 = new GamePlayer(playerD, game3);
			GamePlayer gamePlayer7 = new GamePlayer(playerB, game4);
			GamePlayer gamePlayer8 = new GamePlayer(playerA, game4);
			GamePlayer gamePlayer9 = new GamePlayer(playerD, game5);
			GamePlayer gamePlayer10 = new GamePlayer(playerA, game5);
			GamePlayer gamePlayer11 = new GamePlayer(playerC, game6);
			GamePlayer gamePlayer12 = new GamePlayer(playerD, game7);
			GamePlayer gamePlayer13 = new GamePlayer(playerC, game8);
			GamePlayer gamePlayer14 = new GamePlayer(playerD, game8);

			gameplayerRepository.save(gamePlayer1);
			gameplayerRepository.save(gamePlayer2);
			gameplayerRepository.save(gamePlayer3);
			gameplayerRepository.save(gamePlayer4);
			gameplayerRepository.save(gamePlayer5);
			gameplayerRepository.save(gamePlayer6);
			gameplayerRepository.save(gamePlayer7);
			gameplayerRepository.save(gamePlayer8);
			gameplayerRepository.save(gamePlayer9);
			gameplayerRepository.save(gamePlayer10);
			gameplayerRepository.save(gamePlayer11);
			gameplayerRepository.save(gamePlayer12);
			gameplayerRepository.save(gamePlayer13);
			gameplayerRepository.save(gamePlayer14);

			List<String> locations1A1 = Arrays.asList("H2", "H3", "H4");
			List<String> locations1A2 = Arrays.asList("E1", "F1", "G1");
			List<String> locations1A3 = Arrays.asList("B4", "B5");
			List<String> locations1B1 = Arrays.asList("B5", "C5", "D5");
			List<String> locations1B2 = Arrays.asList("F1", "F2");
			List<String> locations2A1 = Arrays.asList("B5", "C5", "D5");
			List<String> locations2A2 = Arrays.asList("C6", "C7");
			List<String> locations2B1 = Arrays.asList("A2", "A3", "A4");
			List<String> locations2B2 = Arrays.asList("G6", "H6");

			Ship ship1A1 = new Ship("Destroyer", locations1A1, gamePlayer1);
			Ship ship1A2 = new Ship("Submarine", locations1A2, gamePlayer1);
			Ship ship1A3 = new Ship("Patrol Boat", locations1A3, gamePlayer1);
			Ship ship1B1 = new Ship("Destroyer", locations1B1, gamePlayer2);
			Ship ship1B2 = new Ship("Patrol Boat", locations1B2, gamePlayer2);
			Ship ship2A1 = new Ship("Destroyer", locations2A1, gamePlayer3);
			Ship ship2A2 = new Ship("Patrol Boat", locations2A2, gamePlayer3);
			Ship ship2B1 = new Ship("Submarine", locations2B1, gamePlayer4);
			Ship ship2B2 = new Ship("Patrol Boat", locations2B2, gamePlayer4);
			Ship ship3A1 = new Ship("Destroyer", locations2A1, gamePlayer5);
			Ship ship3A2 = new Ship("Patrol Boat", locations2A2, gamePlayer5);
			Ship ship3B1 = new Ship("Submarine", locations2B1, gamePlayer6);
			Ship ship3B2 = new Ship("Patrol Boat", locations2B2, gamePlayer6);
			Ship ship4A1 = new Ship("Destroyer", locations2A1, gamePlayer7);
			Ship ship4A2 = new Ship("Patrol Boat", locations2A2, gamePlayer7);
			Ship ship4B1 = new Ship("Submarine", locations2B1, gamePlayer8);
			Ship ship4B2 = new Ship("Patrol Boat", locations2B2, gamePlayer8);
			Ship ship5A1 = new Ship("Destroyer", locations2A1, gamePlayer9);
			Ship ship5A2 = new Ship("Patrol Boat", locations2A2, gamePlayer9);
			Ship ship5B1 = new Ship("Submarine", locations2B1, gamePlayer10);
			Ship ship5B2 = new Ship("Patrol Boat", locations2B2, gamePlayer10);
			Ship ship6A1 = new Ship("Destroyer", locations2A1, gamePlayer11);
			Ship ship6A2 = new Ship("Patrol Boat", locations2A2, gamePlayer11);
			Ship ship8A1 = new Ship("Destroyer", locations2A1, gamePlayer13);
			Ship ship8A2 = new Ship("Patrol Boat", locations2A2, gamePlayer13);
			Ship ship8B1 = new Ship("Submarine", locations2B1, gamePlayer14);
			Ship ship8B2 = new Ship("Patrol Boat", locations2B2, gamePlayer14);




			shipRepository.save(ship1A1);
			shipRepository.save(ship1A2);
			shipRepository.save(ship1A3);
			shipRepository.save(ship1B1);
			shipRepository.save(ship1B2);
			shipRepository.save(ship2A1);
			shipRepository.save(ship2A2);
			shipRepository.save(ship2B1);
			shipRepository.save(ship2B2);
			shipRepository.save(ship3A1);
			shipRepository.save(ship3A2);
			shipRepository.save(ship3B1);
			shipRepository.save(ship3B2);
			shipRepository.save(ship4A1);
			shipRepository.save(ship4A2);
			shipRepository.save(ship4B1);
			shipRepository.save(ship4B2);
			shipRepository.save(ship5A1);
			shipRepository.save(ship5A2);
			shipRepository.save(ship5B1);
			shipRepository.save(ship5B2);
			shipRepository.save(ship6A1);
			shipRepository.save(ship6A2);
			shipRepository.save(ship8A1);
			shipRepository.save(ship8A2);
			shipRepository.save(ship8B1);
			shipRepository.save(ship8B2);

			List<String> salvoLocation1 = Arrays.asList("B5", "C5", "F1");
			List<String> salvoLocation2 = Arrays.asList("B4", "B5", "B6");
			List<String> salvoLocation3 = Arrays.asList("F2", "D5");
			List<String> salvoLocation4 = Arrays.asList("E1", "H3", "A2");
			List<String> salvoLocation5 = Arrays.asList("A2", "A4", "G6");
			List<String> salvoLocation6 = Arrays.asList("B5", "D5", "C7");
			List<String> salvoLocation7 = Arrays.asList("A3", "H6");
			List<String> salvoLocation8 = Arrays.asList("C5", "C6");
			List<String> salvoLocation9 = Arrays.asList("G6", "H6", "A4");
			List<String> salvoLocation10 = Arrays.asList("H1", "H2", "H3");
			List<String> salvoLocation11 = Arrays.asList("A2", "A3", "D8");
			List<String> salvoLocation12 = Arrays.asList("E1", "F2", "G3");
			List<String> salvoLocation13 = Arrays.asList("A3", "A4", "F7");
			List<String> salvoLocation14 = Arrays.asList("B5", "C6", "H1");
			List<String> salvoLocation15 = Arrays.asList("A2", "G6", "H6");
			List<String> salvoLocation16 = Arrays.asList("C5", "C7", "D5");
			List<String> salvoLocation17 = Arrays.asList("A1", "A2", "A3");
			List<String> salvoLocation18 = Arrays.asList("B5", "B6", "B7");
			List<String> salvoLocation19 = Arrays.asList("G6", "G7", "G8");
			List<String> salvoLocation20 = Arrays.asList("C6", "D6", "E6");
			List<String> salvoLocation21 = Arrays.asList("H1", "H8");

			Salvo salvo11A = new Salvo(1, salvoLocation1,  gamePlayer1);
			Salvo salvo11B = new Salvo(1, salvoLocation2,  gamePlayer2);
			Salvo salvo12A = new Salvo(2, salvoLocation3,  gamePlayer1);
			Salvo salvo12B = new Salvo(2, salvoLocation4,  gamePlayer2);
			Salvo salvo21A = new Salvo(1, salvoLocation5,  gamePlayer3);
			Salvo salvo21B = new Salvo(1, salvoLocation6,  gamePlayer4);
			Salvo salvo22A = new Salvo(2, salvoLocation7,  gamePlayer3);
			Salvo salvo22B = new Salvo(2, salvoLocation8,  gamePlayer4);
			Salvo salvo31A = new Salvo(1, salvoLocation9,  gamePlayer5);
			Salvo salvo31B = new Salvo(1, salvoLocation10,  gamePlayer6);
			Salvo salvo32A = new Salvo(2, salvoLocation11,  gamePlayer5);
			Salvo salvo32B = new Salvo(2, salvoLocation12,  gamePlayer6);
			Salvo salvo41A = new Salvo(1, salvoLocation13,  gamePlayer7);
			Salvo salvo41B = new Salvo(1, salvoLocation14,  gamePlayer8);
			Salvo salvo42A = new Salvo(2, salvoLocation15,  gamePlayer7);
			Salvo salvo42B = new Salvo(2, salvoLocation16,  gamePlayer8);
			Salvo salvo51A = new Salvo(1, salvoLocation17,  gamePlayer9);
			Salvo salvo51B = new Salvo(1, salvoLocation18,  gamePlayer10);
			Salvo salvo52A = new Salvo(2, salvoLocation19,  gamePlayer9);
			Salvo salvo52B = new Salvo(2, salvoLocation20,  gamePlayer10);
			Salvo salvo53B = new Salvo(2, salvoLocation21,  gamePlayer11);

			salvoRepository.save(salvo11A);
			salvoRepository.save(salvo11B);
			salvoRepository.save(salvo12A);
			salvoRepository.save(salvo12B);
			salvoRepository.save(salvo21A);
			salvoRepository.save(salvo21B);
			salvoRepository.save(salvo22A);
			salvoRepository.save(salvo22B);
			salvoRepository.save(salvo31A);
			salvoRepository.save(salvo31B);
			salvoRepository.save(salvo32A);
			salvoRepository.save(salvo32B);
			salvoRepository.save(salvo41A);
			salvoRepository.save(salvo41B);
			salvoRepository.save(salvo42A);
			salvoRepository.save(salvo42B);
			salvoRepository.save(salvo51A);
			salvoRepository.save(salvo51B);
			salvoRepository.save(salvo52A);
			salvoRepository.save(salvo52B);
			salvoRepository.save(salvo53B);


			Score score1 = new Score(game1, playerA, 1.0);
			Score score2 = new Score(game1, playerB, 0.0);
			Score score3 = new Score(game2, playerA, 0.5);
			Score score4 = new Score(game2, playerB, 0.5);
			Score score5 = new Score(game3, playerB, 1.0);
			Score score6 = new Score(game3, playerD, 0.0);
			Score score7 = new Score(game4, playerB, 0.5);
			Score score8 = new Score(game4, playerC, 0.5);


			scoreRepository.save(score1);
			scoreRepository.save(score2);
			scoreRepository.save(score3);
			scoreRepository.save(score4);
			scoreRepository.save(score5);
			scoreRepository.save(score6);
			scoreRepository.save(score7);
			scoreRepository.save(score8);




		};

	}



}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {
	@Autowired
	PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userName-> {
			Player player = playerRepository.findByUserName(userName);
			if (player != null) {
				return new User(player.getUserName(), player.getPassword(),
						AuthorityUtils.createAuthorityList("USER"));
			} else {
				throw new UsernameNotFoundException("Unknown user: " + userName);
			}
		});
	}
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
//				.antMatchers("/**").permitAll()
				.antMatchers("/web/scripts/**").permitAll()
				.antMatchers("/web/games.html").permitAll()
				.antMatchers("/web/styles/**").permitAll()

				.antMatchers("/web/game.html").permitAll()

				.antMatchers("/api/games").permitAll()
				.antMatchers("/api/players").permitAll()
				.antMatchers("/api/login").permitAll()
				.antMatchers("/favicon.ico").permitAll()
				.antMatchers("/rest/**").denyAll()
				.anyRequest().fullyAuthenticated()
				.and()
				.formLogin();

		http.formLogin()
				.usernameParameter("userName")
				.passwordParameter("password")
				.loginPage("/api/login");

		http.logout().logoutUrl("/api/logout");

		// turn off checking for CSRF tokens
		http.csrf().disable();

		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());

	}
	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}

}