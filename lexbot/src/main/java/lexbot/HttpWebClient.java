package lexbot;

import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;
import org.apache.cxf.jaxrs.client.WebClient;

import java.util.ArrayList;
import java.util.List;

import static lexbot.CommonConstants.*;

class HttpWebClient {

    WebClient getClient(String userID) {
        try {
            final String canonicalUri = String.format("/bot/%s/alias/%s/user/%s/%s/", BOT_NAME, BOT_ALIAS, userID, POST_ACTION);

            final List<Object> providers = new ArrayList<Object>();
            providers.add(new JacksonJaxbJsonProvider());

            final WebClient client = WebClient.create(END_POINT, providers);
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
