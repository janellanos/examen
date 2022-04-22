package ec.edu.insteclrg;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

	private final DataSource dataSource;

	public SpringSecurityConfig(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication().dataSource(dataSource)
				.usersByUsernameQuery("select name, password, enabled from users where name=?")
				.authoritiesByUsernameQuery("select name, rol from users where name=?")
				.passwordEncoder(new BCryptPasswordEncoder());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		/*http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().csrf().disable()
				- servicio es la base de datos no conecta xq no hay una base de datos del tipo servicio
				
				.authorizeRequests()
				.antMatchers("/v1.0/servicio/**").authenticated()
				.antMatchers("/v1.0/producto/**").hasRole("USER")
				.antMatchers( "/v1.0/categoria/**").hasRole("ADMIN")
				.antMatchers("/**").permitAll().and()
				.httpBasic();*/
		
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().csrf().disable()
		.authorizeRequests()
		.antMatchers(HttpMethod.GET, "/v1.0/exam2/**").authenticated()
		.antMatchers(HttpMethod.POST ,"/v1.0/exam2/**").hasRole("ADMIN")
		.antMatchers( HttpMethod.DELETE,"/v1.0/exam2/**").hasRole("ADMIN")
		.antMatchers( HttpMethod.PUT,"/v1.0/exam2/**").hasRole("ADMIN")
		.antMatchers("/**").permitAll().and()
		.httpBasic();
		
		
		
	
		
	}
}