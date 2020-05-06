package lexbot;

import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import org.apache.cxf.jaxrs.client.WebClient;

import java.util.ArrayList;
import java.util.List;

import static lexbot.CommonConstants.*;
import static lexbot.CommonConstants.CONTENT_TYPE;

class HttpEstimateClient {
    WebClient getClient() {
        try {
            final String canonicalUri = "/estimate";

            final List<Object> providers = new ArrayList<Object>();
            providers.add(new JacksonJaxbJsonProvider());

            final WebClient client = WebClient.create(ESTIMATE_API, providers);
            client.accept(CONTENT_TYPE)
                    .type(CONTENT_TYPE)
                    .path(canonicalUri);
            return client;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
