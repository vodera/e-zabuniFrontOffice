/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ke.co.tracom.gulf.bank.entities;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 *
 * @author Cornelius M
 */
@Component
@ConfigurationProperties(prefix = "app.params.google.recaptcha")
public class GoogleCaptcha {
    
    private String site;
    private String secret;

    public GoogleCaptcha() {
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
    

}
