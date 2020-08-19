/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ke.co.tracom.gulf.bank.configs;

import org.springframework.security.core.AuthenticationException;

/**
 *
 * @author Cornelius M
 */
public class CaptchaAuthenticationException extends AuthenticationException {

    public CaptchaAuthenticationException(String msg, Throwable t) {
        super(msg, t);
    }

    public CaptchaAuthenticationException(String msg) {
        super(msg);
    }
    
    

}
