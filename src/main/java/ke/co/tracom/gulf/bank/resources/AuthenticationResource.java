/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ke.co.tracom.gulf.bank.resources;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import ke.co.tracom.gulf.bank.entities.ResponseWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.error.DefaultWebResponseExceptionTranslator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestClientException;

/**
 *
 * @author Cornelius M
 */
@Controller
public class AuthenticationResource {

    private final OAuth2RestTemplate template;
    @Value("${app.params.api-url}")
    private String dashboardUrl;
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public AuthenticationResource(OAuth2RestTemplate template) {
        this.template = template;
    }

    @RequestMapping(value = "/login-response", method = RequestMethod.GET)
    public ResponseEntity processLogin(ResponseWrapper response, @RequestParam("error") String error, @RequestParam("code") int code) {
        response.setCode(code);
        response.setMessage(error);
        return ResponseEntity.status(code).body(response);
    }

    @RequestMapping(value = {"/login", "login.html"}, method = RequestMethod.GET)
    public String login(Authentication a, HttpServletRequest request) {
        if (a != null && a.isAuthenticated()) {
            try {
                template.headForHeaders(dashboardUrl + "/dashboard");
                return "redirect:/";
            } catch (RestClientException ex) {
                if (!ex.getMessage().contains("Server returned HTTP response code: 401")) {
                    return "redirect:/login#/otp";
                }

            }
        } else {
            log.debug("Current url context path: " + request.getServletPath());
        }
        return "login";
    }

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ResponseEntity<ResponseWrapper> loginJson() {
        ResponseWrapper response = new ResponseWrapper();
        response.setMessage("Access denied, this may due to permissions or page has expired reload the page and try again");
        response.setCode(403);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @RequestMapping(value = "/login-succesful", method = RequestMethod.GET)
    public ResponseEntity processSuccess(HttpServletRequest request) {
        ResponseWrapper response = new ResponseWrapper();
        Map<String, Object> data = new HashMap<>();
        data.put("timeout",  request.getSession().getMaxInactiveInterval());
        data.put("userInfo", template.getAccessToken().getAdditionalInformation());
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/login#/otp", method = RequestMethod.GET)
    public String otp() {
        return "login";
    }

    @RequestMapping(value = {"/", "index.html"}, method = RequestMethod.GET)
    public String index() {
        return "index";
    }
    
    @GetMapping(value = "/error")
    public ResponseEntity<ResponseWrapper> internalServerError(Exception e){
        ResponseWrapper response = new ResponseWrapper();
        response.setCode(500);
        response.setMessage("Sorry internal server error occured please try again later");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
