package com.answer.notinote;

import com.answer.notinote.Config.properties.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class NotinoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotinoteApplication.class, args);
	}

}
