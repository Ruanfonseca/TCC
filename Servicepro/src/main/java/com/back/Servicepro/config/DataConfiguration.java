package com.back.Servicepro.config;


import org.hibernate.dialect.PostgreSQLDialect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;

@Configuration
public class DataConfiguration {
/*
    @Bean
    public DataSource dataSource(){
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postresql.Driver");
        dataSource.setUrl("jdbc:postgresql://localhost:5432/ServiceProDB");
        dataSource.setUsername("postgres");
        dataSource.setPassword("ruan123");

        return dataSource;
    }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setDatabase(Database.POSTGRESQL);
        adapter.setShowSql(true);
        adapter.setGenerateDdl(true);
        adapter.setDatabasePlatform(PostgreSQLDialect.class.getName());
        adapter.setPrepareConnection(true);
        return adapter;
    }

	@Bean
	public ConnectionFactory rabbitConnectionFactory(){
		CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
		connectionFactory.setHost("rabbitmq");
		connectionFactory.setPort(5672);
		connectionFactory.setUsername("admin");
		connectionFactory.setPassword("123456");
		return connectionFactory;

	}
*/
}
