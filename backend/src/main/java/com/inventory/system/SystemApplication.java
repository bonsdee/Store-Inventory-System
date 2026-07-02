package com.inventory.system;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SystemApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
            System.out.println("================================");
            for (String beanName : ctx.getBeanDefinitionNames()) {
                if (beanName.toLowerCase().contains("notification")) {
                    System.out.println(beanName);
                }
            }
            System.out.println("================================");
        };
    }
}