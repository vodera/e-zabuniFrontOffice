package ke.co.tracom.gulf.bank.configs;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;
import org.springframework.security.oauth2.common.AuthenticationScheme;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ke.co.tracom.gulf.bank.entities.GoogleCaptcha;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.provider.error.DefaultWebResponseExceptionTranslator;
import org.springframework.security.oauth2.provider.error.WebResponseExceptionTranslator;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
//@EnableOAuth2Sso
@EnableOAuth2Client

//@EnableOAuth2Sso
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    OAuth2ClientContext oauth2ClientContext;
    @Value("${security.oauth2.client.clientId}")
    private String clientId;
    @Value("${security.oauth2.client.clientSecret}")
    private String clientSecret;
    @Value("${security.oauth2.client.accessTokenUri}")
    private String accessTokenUri;
    @Value("${security.oauth2.resource.userInfoUri}")
    private String userEndpoint;
    @Value("${app.params.api-url}")
    private String baseUrl;
    @Autowired
    private ServletContext servletContext;
    @Autowired
    private GoogleCaptcha captchaDetails;
    private final org.slf4j.Logger log = LoggerFactory.getLogger(this.getClass());
    private WebResponseExceptionTranslator authenticationEntryPoint;

    public WebSecurityConfig() {
        log.info("Processing  web security configuration");
        try {
            Context initCxt = new InitialContext();
            Context envCtx = (Context) initCxt.lookup("java:comp/env");
            envCtx.lookup("cashCollectionApiUrl");
           // log.info("Retrieved api url {} from jndi", apiUrl);
//            if(apiUrl == null){
//                log.info("Failed to find api url in container context resources using default url {}", baseUrl);
//            } else {
//                log.info("Found api url ({}) in container context", apiUrl);
//            }
        } catch (NamingException ex) {
            Logger.getLogger(WebSecurityConfig.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/test", "/css/**", "/js/**", "/scripts/**", "/favicon.ico",
                        "/process-login", "/login-response", "/img/**",
                        "/oauth/token", "/access-denied", "/api/users/password", "/api/users/forgot-password",
                        "/templates/changepassword-box.html", "/templates/login-box.html", "/templates/login-box.min.html",
                        "/templates/otp-box.html", "/templates/forgot-password.html", "/api/sys-config/password", "/",
                        "/templates/dashboard.html", "templates/enter-offline-request.html",
                        "/templates/user-list.html", "api/users", "/templates/user-view.html",
                        "/templates/create-customer.html", "/templates/user-profile.html",
                        "/templates/tender-list.html", "/templates/tender-view.html", "/templates/registration.html",
                        "/templates/company-info.html", "/templates/password-change.html", "/templates/table-footer.html",
                        "/templates/completed-tenders.html", "/templates/applied-tenders.html",
                        "/templates/completedtender-view.html", "/templates/evaluation-list.html", "/templates/tender-documents.html").permitAll()
                .antMatchers("/api/**").hasAnyRole("2", "1")
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new AuthenticationExceptionHandler())
                .accessDeniedHandler(new CustomAccessDeniedHandler(servletContext.getContextPath()))
                .and()
                .formLogin()
                .loginPage("/login")
                .failureHandler(new CustomFailureHandler())
                .successForwardUrl("/")
                .failureForwardUrl("/login-response")
                .permitAll()
                .and()
                .addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class)
                .logout()
                .addLogoutHandler(new CustomLogoutHandler(template, baseUrl))
                .permitAll();
    }

    @Bean
    @Primary
    protected WebResponseExceptionTranslator exceptionTranslator() {
        return new CustomExceptionTranslator();
    }

    @Bean
    @Primary
    protected OAuth2ProtectedResourceDetails resource() {
        ResourceOwnerPasswordResourceDetails resource = new ResourceOwnerPasswordResourceDetails();
        resource.setAccessTokenUri(this.accessTokenUri);
        resource.setClientId(this.clientId);
        resource.setClientSecret(this.clientSecret);
        resource.setClientAuthenticationScheme(AuthenticationScheme.form);
        resource.setClientAuthenticationScheme(AuthenticationScheme.header);

        return resource;
    }
    @Autowired
    private OAuth2RestTemplate template;

    @Bean
    public OAuth2RestTemplate restTemplate() {
        OAuth2RestTemplate temp = new OAuth2RestTemplate(this.resource(), oauth2ClientContext);
        temp.setAccessTokenProvider(new CustomTokenProvider());
        return temp;
    }

    private Filter ssoFilter() {
        OAuth2ClientAuthenticationProcessingFilter oauthFilter = /*OAuth2ClientAuthenticationProcessingFilter*/ new CustomAuthenticationProcessingFilter("/process-login", captchaDetails);
        oauthFilter.setRestTemplate(template);
        oauthFilter.setAuthenticationFailureHandler(new CustomFailureHandler());
        oauthFilter.setAuthenticationSuccessHandler(new CustomSuccessHandler());
        UserInfoTokenServices tokenServices = new UserInfoTokenServices(this.userEndpoint, resource().getClientId());
        tokenServices.setRestTemplate(template);
        oauthFilter.setTokenServices(tokenServices);
        return oauthFilter;
    }

    private class CustomSuccessHandler implements AuthenticationSuccessHandler {

        @Override
        public void onAuthenticationSuccess(HttpServletRequest hsr, HttpServletResponse response, Authentication a) throws IOException, ServletException {
            System.out.println("Custom success handler invoked...");
            response.sendRedirect(servletContext.getContextPath() + "/login-succesful");
        }

    }

    private class CustomFailureHandler implements AuthenticationFailureHandler {

        protected final DefaultWebResponseExceptionTranslator translator = new DefaultWebResponseExceptionTranslator();

        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException ae) throws IOException, ServletException {
            System.out.println("Authentication failure handler invoked context path:  " + servletContext.getContextPath());
            String error = "Sorry you are not authorized to use this resource";
            int code = 400;
            try {
                ResponseEntity<OAuth2Exception> reponseEntity = translator.translate(ae);

                if (ae instanceof BadCredentialsException && reponseEntity.getBody() != null) {
                    code = Integer.valueOf(reponseEntity.getBody().getAdditionalInformation().get("code"));
                    error = reponseEntity.getBody().getMessage();
                } else if (ae instanceof CaptchaAuthenticationException) {
                    error = ae.getMessage();
                }
            } catch (Exception ex) {
                log.error("Encounter error while performing authentication", ex);
                error = "Sorry internal server error occured please contact customer support for assistance";
            }
            response.sendRedirect(servletContext.getContextPath() + "/login-response?error=" + error + "&code=" + code);
        }

    }

    class CustomLogoutHandler implements LogoutHandler {

        private final OAuth2RestTemplate temp;
        private final String baseUrl;

        CustomLogoutHandler(OAuth2RestTemplate template, String baseUrl) {
            this.temp = template;
            this.baseUrl = baseUrl;
        }

        @Override
        public void logout(HttpServletRequest request, HttpServletResponse response, Authentication a) {
            temp.postForLocation(baseUrl + "/oauth/logout", null);
            a.setAuthenticated(false);
            request.getSession().invalidate();
            response.setStatus(200);
        }
    }
}
