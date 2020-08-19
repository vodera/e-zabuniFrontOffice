package ke.co.tracom.gulf.bank;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GulfBankDashboardApplicationTests {

    @Autowired
    OAuth2ClientContext oauth2ClientContext;
    @Value("${app.params.api-url}")
    private String apiUrl;
    @Value("${security.oauth2.client.clientId}")
    private String clientId;
    @Value("${security.oauth2.client.clientSecret}")
    private String clientSecret;
    @Value("${security.oauth2.client.accessTokenUri}")
    private String accessTokenUri;

    public GulfBankDashboardApplicationTests() {
    }

    @Test
    public void checkApiConnection() {
        RestTemplate restTemplate = new RestTemplate();
        Throwable thrown = catchThrowable(() -> {
            HttpHeaders headers = restTemplate.headForHeaders(apiUrl);
            throw new Exception();

        });
        assertThat(thrown).withFailMessage("The cash collection api cannot be reached on " + apiUrl).isNotInstanceOf(org.springframework.web.client.HttpClientErrorException.class);
    }

    @Test
    public void testClientDetails() {
        ClientCredentialsResourceDetails resource = new ClientCredentialsResourceDetails();
        resource.setAccessTokenUri(this.accessTokenUri);
        resource.setClientId(this.clientId);
        resource.setClientSecret(this.clientSecret);

        OAuth2RestTemplate template = new OAuth2RestTemplate(resource, this.oauth2ClientContext);

        Throwable thrown = catchThrowable(() -> {
            OAuth2AccessToken accessToken = template.getAccessToken();
            throw new Exception();
        });
        assertThat(thrown).withFailMessage("Authorization failed with the supplied client credentials").isNotInstanceOf(org.springframework.security.oauth2.client.resource.OAuth2AccessDeniedException.class);

    }
}
