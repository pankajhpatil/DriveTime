package lexbot;

import org.apache.cxf.jaxrs.client.WebClient;

public class Main {

    public static void main(String args[]) {
        String id = "123";
        String question = "Book a Vehicle";
//        String question = "400056";
//        String question = "400057";
//        String question = "34";
        HttpWebClient httpWebClient = new HttpWebClient();
        LexBotController test = new LexBotController();
        System.out.println(test.chat(httpWebClient.getClient(id), question, id));
    }
}
