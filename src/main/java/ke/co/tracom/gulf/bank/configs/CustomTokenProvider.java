/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ke.co.tracom.gulf.bank.configs;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.oauth2.client.resource.OAuth2AccessDeniedException;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultRequestEnhancer;
import org.springframework.security.oauth2.client.token.RequestEnhancer;
import org.springframework.security.oauth2.client.token.auth.ClientAuthenticationHandler;
import org.springframework.security.oauth2.client.token.auth.DefaultClientAuthenticationHandler;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordAccessTokenProvider;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestClientException;

/**
 *
 * @author Cornelius M
 */
public class CustomTokenProvider extends ResourceOwnerPasswordAccessTokenProvider {

    private final ClientAuthenticationHandler authenticationHandler = new DefaultClientAuthenticationHandler();
    private final RequestEnhancer tokenRequestEnhancer = new DefaultRequestEnhancer();

    @Override
    protected OAuth2AccessToken retrieveToken(AccessTokenRequest request, OAuth2ProtectedResourceDetails resource,
            MultiValueMap<String, String> form, HttpHeaders headers) throws OAuth2AccessDeniedException {
        System.out.println("Retrieving access token from the authorization server");
        try {
            // Prepare headers and form before going into rest template call in case the URI is affected by the result
            authenticationHandler.authenticateTokenRequest(resource, form, headers);
            // Opportunity to customize form and headers
            tokenRequestEnhancer.enhance(request, resource, form, headers);
            final AccessTokenRequest copy = request;

            final ResponseExtractor<OAuth2AccessToken> delegate = getResponseExtractor();
            ResponseExtractor<OAuth2AccessToken> extractor = (ClientHttpResponse response) -> {
                if (response.getHeaders().containsKey("Set-Cookie")) {
                    copy.setCookie(response.getHeaders().getFirst("Set-Cookie"));
                }
                return delegate.extractData(response);
            };
            return getRestTemplate().execute(getAccessTokenUri(resource, form), getHttpMethod(),
                    getRequestCallback(resource, form, headers), extractor, form.toSingleValueMap());

        } catch (OAuth2Exception oe) {
            if (oe.getAdditionalInformation().containsKey("message")) {
                OAuth2AccessDeniedException exception = new OAuth2AccessDeniedException(oe.getAdditionalInformation().get("message"), resource, oe);
                exception.addAdditionalInformation("code", oe.getAdditionalInformation().get("code"));
                throw exception;
            } else {
                throw new OAuth2AccessDeniedException("Access token denied.", resource, oe);
            }
        } catch (RestClientException rce) {
            throw new OAuth2AccessDeniedException("Error requesting access token.", resource, rce);
        }
    }
}
