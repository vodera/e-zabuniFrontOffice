/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ke.co.tracom.gulf.bank.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ke.co.tracom.gulf.bank.entities.ResponseWrapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/**
 *
 * @author Cornelius M
 */
public class CustomAccessDeniedHandler implements AccessDeniedHandler{
    
    private final String contextPath;
    
    public CustomAccessDeniedHandler(String contextPath){
        this.contextPath = contextPath;
    }
    
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ade) throws IOException, ServletException {
        response.setStatus(403);
        response.setHeader("Content-Type", "application/json");
        ObjectMapper mapper = new ObjectMapper();
        ResponseWrapper responseObject = new ResponseWrapper();
        responseObject.setMessage("Access denied, this may due to permissions or page has expired reload the page and try again");
        responseObject.setCode(403);
        String responseMsg = mapper.writeValueAsString(responseObject);
        response.getWriter().write(responseMsg);
    }

}
