/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ke.co.tracom.gulf.bank.configs;

import ke.co.tracom.gulf.bank.entities.ResponseWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 *
 * @author Cornelius M
 */
@org.springframework.web.bind.annotation.ControllerAdvice
@Primary
public class ErrorResourceAdvice {
    
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public ErrorResourceAdvice() {
    }

     @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ResponseWrapper> entityRetriavalFailure(org.springframework.security.authentication.BadCredentialsException ex) {
        log.error("Constraint violation", ex);
        ResponseWrapper response = new ResponseWrapper();
        response.setCode(400);
        response.setMessage("Failed to locate items with the specified id(s)");
        return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ResponseWrapper> accessDeniedHandler(org.springframework.security.access.AccessDeniedException ex) {
        log.error("Constraint violation", ex);
        ResponseWrapper response = new ResponseWrapper();
        response.setCode(400);
        response.setMessage("Failed to locate items with the specified id(s)");
        return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
    }
    }
