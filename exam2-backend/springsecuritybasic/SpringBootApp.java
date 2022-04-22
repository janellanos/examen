package ec.edu.insteclrg.springsecuritybasic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"ec.edu.insteclrg"})
@EntityScan("ec.edu.insteclrg.springsecuritybasic.model")
@EnableJpaRepositories("ec.edu.insteclrg.common.persistence")
public class SpringBootApp extends SpringBootServletInitializer {

	 @Override protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
	        return builder.sources(SpringApplicationBuilder.class);
	    }
    public static void main(String[] args) {
        SpringApplication.run(SpringBootApp.class, args);
    }

}
