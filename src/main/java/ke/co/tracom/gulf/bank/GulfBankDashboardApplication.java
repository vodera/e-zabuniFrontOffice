package ke.co.tracom.gulf.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
public class GulfBankDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(GulfBankDashboardApplication.class, args);
	}
}


