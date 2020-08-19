/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ke.co.tracom.gulf.bank.configs;

import java.util.HashMap;
import java.util.Map;
import ke.co.tracom.gulf.bank.entities.ResponseWrapper;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.provider.error.WebResponseExceptionTranslator;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;

/**
 *
 * @author Cornelius M
 */
@Component
@Primary
public class CustomExceptionTranslator implements WebResponseExceptionTranslator {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public ResponseEntity<OAuth2Exception> translate(Exception e) throws Exception {
        ResponseWrapper response = new ResponseWrapper();
        Map<String, String> data = new HashMap();

        log.error("Authentication exception: ", e);
        if (e instanceof InvalidGrantException) {
            InvalidGrantException ie = (InvalidGrantException) e;
            data.put("error", ie.getOAuth2ErrorCode());
            data.put("error_description", ie.getMessage());
            response.setData(data);
            if (ie.getMessage().equalsIgnoreCase("User is Disabled")) {
                response.setMessage("Sorry the account is disabled");
            } 
//            else if (e.getMessage().equals(AppConstants.MSG_ACCOUNT_EXPIRED)) {
//                response.setCode(HttpStatus.GONE.value());
//                response.setMessage(AppConstants.MSG_ACCOUNT_EXPIRED);
//                return new ResponseEntity(response, HttpStatus.GONE);
//            } 
            else {
                response.setMessage(ie.getMessage());
            }
            response.setCode(ie.getHttpErrorCode());
            return new ResponseEntity(response, HttpStatus.valueOf(ie.getHttpErrorCode()));
        } else if (e instanceof OAuth2Exception) {
            OAuth2Exception oauthException = (OAuth2Exception) e;
            response.setCode(oauthException.getHttpErrorCode());
            response.setMessage("Please provide valid cradentials");
            data.put("error", oauthException.getOAuth2ErrorCode());
            data.put("error_description", oauthException.getMessage());
            response.setData(data);
            return new ResponseEntity(response, HttpStatus.valueOf(oauthException.getHttpErrorCode()));
        } else if (e instanceof InternalAuthenticationServiceException) {
            response.setCode(401);
            response.setMessage("Sorry internal authentication error occured");
            data.put("error_description", e.getMessage());
            response.setData(data);
            return new ResponseEntity(response, HttpStatus.UNAUTHORIZED);
        } else if (e instanceof LockedException) {
            response.setCode(HttpStatus.LOCKED.value());
            response.setMessage(e.getMessage());
            data.put("error_description", e.getMessage());
            response.setData(data);
            return new ResponseEntity(response, HttpStatus.LOCKED);
        } 
//        else if (e instanceof RunTimeBadRequest) {
//            response.setCode(HttpStatus.LOCKED.value());
//            response.setMessage(e.getMessage());
//            //data.put("error_description", e.getMessage());
//            response.setData(data);
//            return new ResponseEntity(response, HttpStatus.LOCKED);
//        } 
        else if (e instanceof AccessDeniedException) {
            response.setCode(HttpStatus.FORBIDDEN.value());
            response.setMessage(e.getMessage());
            data.put("error_description", e.getMessage());
            response.setData(data);
            return new ResponseEntity(response, HttpStatus.FORBIDDEN);
        } else if (e instanceof CredentialsExpiredException) {
            response.setCode(HttpStatus.GONE.value());
            response.setMessage(e.getMessage());
            data.put("error_description", e.getMessage());
            response.setData(data);
            return new ResponseEntity(response, HttpStatus.GONE);
        } 
//        else if (e instanceof org.springframework.mail.MailSendException) {
//            response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
//            response.setMessage("Sorry internal server error occured");
//            data.put("error_description", "Failed to reach mail server please check connection or mail credentials");
//            response.setData(data);
//            return new ResponseEntity(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
        else {

            log.error("Found unknown authentication exception");
            throw e;
        }

    }

}
