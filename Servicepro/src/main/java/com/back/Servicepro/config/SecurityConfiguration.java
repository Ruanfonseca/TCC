package com.back.Servicepro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter;

    private static final String[] SWAGGER_LIST = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/swagger-resources",
            "/swagger-ui.html" // Ensure this is included
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(SWAGGER_LIST).permitAll() // Ensure Swagger endpoints are accessible
                        .requestMatchers(HttpMethod.POST, "/usuario/cadastrar").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/professor/cadastrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/usuario/listagem**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/usuario/busca/matricula").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/usuario/editar").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/usuario/deletar").permitAll()

                        .requestMatchers(HttpMethod.POST, "/requerimento/cadastrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/requerimento/listagem").permitAll()
                        .requestMatchers(HttpMethod.POST, "/requerimento/busca/nome").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/requerimento/editar").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/requerimento/editar/pendente").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/requerimento/deletar").permitAll()

                        .requestMatchers(HttpMethod.GET, "/relatorio/listagem").permitAll()

                        .requestMatchers(HttpMethod.GET, "/sala/listagem").permitAll()
                        .requestMatchers(HttpMethod.POST, "/sala/cadastrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sala/busca/nome").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/sala/editar").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/sala/deletar").permitAll()

                        .requestMatchers(HttpMethod.POST, "/horario/cadastrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/horario/listagem").permitAll()
                        .requestMatchers(HttpMethod.POST, "/horario/busca/nome").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/horario/editar").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/horario/deletar").permitAll()

                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/validate").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/refresh-token").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/auth/recuperacao/alterarsenha").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/auth/recuperacao").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
