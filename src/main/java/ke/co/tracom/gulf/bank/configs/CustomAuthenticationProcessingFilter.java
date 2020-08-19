/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ke.co.tracom.gulf.bank.configs;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ke.co.tracom.gulf.bank.entities.CaptchaResponse;
import ke.co.tracom.gulf.bank.entities.GoogleCaptcha;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author Cornelius M
 */
public class CustomAuthenticationProcessingFilter extends OAuth2ClientAuthenticationProcessingFilter {

    private final GoogleCaptcha captchaDetails;
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public CustomAuthenticationProcessingFilter(String defaultFilterProcessesUrl, GoogleCaptcha captchaDetails) {
        super(defaultFilterProcessesUrl);
        this.captchaDetails = captchaDetails;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        
//        System.out.println("Attempting authentication for user " + request.getParameter("g-recaptcha-response"));
        //request.getSession().invalidate();
        if (request.getParameter("g-recaptcha-response") == null) {
            throw new CaptchaAuthenticationException("Captcha verification failed");
        }
        //validating captcha from google api
        RestTemplate template = new RestTemplate();
        Map<String, String> body = new HashMap<>();
        body.put("secret", this.captchaDetails.getSecret());
        body.put("response", request.getParameter("g-recaptcha-response"));
        body.put("remoteip", this.captchaDetails.getSite());
        CaptchaResponse captchaResponse = template.postForEntity("https://www.google.com/recaptcha/api/siteverify?secret="
                + this.captchaDetails.getSecret() + "&response=" + request.getParameter("g-recaptcha-response")
                + "&remoteip=" + this.captchaDetails.getSite(),
                body, CaptchaResponse.class).getBody();
        if (captchaResponse.isSuccess()) {
            //remove security context inorder to request a new token
            request.getSession().removeAttribute("scopedTarget.oauth2ClientContext");
            request.getSession().removeAttribute("SPRING_SECURITY_CONTEXT");
            return super.attemptAuthentication(request, response); //To change body of generated methods, choose Tools | Templates.
        } else {
            throw new CaptchaAuthenticationException("Captcha verification failed");
        }
    }

}
