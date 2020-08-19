/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ke.co.tracom.gulf.bank.entities;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Cornelius M
 */
public class ResponseWrapper <T> implements Serializable{    
    private int code;
    private String message;
    private T data;
    private Long timestamp;
    public ResponseWrapper(){
        this.code = 200;
        this.message = "Request was successful";
        this.timestamp = new Date().getTime();
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
      
}