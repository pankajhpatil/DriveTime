package lexbot;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.jaxrs.impl.MetadataMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.List;

import static lexbot.CommonConstants.CONTENT_TYPE;
import static org.apache.cxf.common.util.StringUtils.isEmpty;

@Path("/bot")
public class LexBotController {
    private static final Logger logger = LoggerFactory.getLogger(LexBotController.class);

    private ObjectMapper mapper = null;
    private HttpWebClient httpWebClient;
    private HttpEstimateClient httpEstimateClient;

    public LexBotController() {
        try {
            mapper = new ObjectMapper();
            httpWebClient = new HttpWebClient();
            httpEstimateClient = new HttpEstimateClient();
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error in LexBotController() ", e);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String bot(@DefaultValue("Hello") @QueryParam("question") String question,
                      @DefaultValue("myId") @QueryParam("id") String id) {
        return chat(httpWebClient.getClient(id), question, id);
    }

    public String chat(WebClient client, String requestText, String id) {
        try {
            if (isEmpty(requestText)) {
                return null;
            }

            final String requestParameters = String.format("{\"inputText\": \"%s\", \"sessionAttributes\": {\"attr_name\" : \"value\"}}", requestText);

            final MetadataMap<String, String> headersMap = new MetadataMap<String, String>();
            headersMap.add("Content-Type", CONTENT_TYPE);
            headersMap.add("X-Amz-Date", LexBotUtil.getAmzDate());
            headersMap.add("Authorization", LexBotUtil.getAuthorizationHeader(id, requestParameters));
            client.headers(headersMap);

            Response response = client.post(requestParameters);
            InputStream responseStream = (InputStream) response.getEntity();
            if (response.getStatus() == 200) {
                LexBotResponse botResponse = new LexBotResponse();
                botResponse.setReadyForFulfilment(Boolean.FALSE);
                JsonNode jsonNode = mapper.readTree(responseStream);
                String dialogState = jsonNode.get("dialogState").asText("");
                String answer = "I didn't understand. Please try again!";
                if (dialogState.startsWith("Elicit")) {
                    answer = jsonNode.get("message").asText("");
                } else if (dialogState.startsWith("ReadyForFulfillment")) {
                    Estimate estimate = new Estimate();
                    int plan, timeSlot;
                    String startDate, endDate, cityName;
                    botResponse.setReadyForFulfilment(Boolean.TRUE);
                    plan = jsonNode.get("slots").get("Plan").asInt();
                    startDate = jsonNode.get("slots").get("StartDate").asText();
                    endDate = jsonNode.get("slots").get("EndDate").asText();
                    timeSlot = jsonNode.get("slots").get("TimeSlot").asInt();
                    cityName = jsonNode.get("slots").get("City").asText();
                    estimate.setPlan(plan);
                    estimate.setStartDate(startDate);
                    estimate.setEndDate(endDate);
                    estimate.setTimeSlot(timeSlot);
                    estimate.setCityName(cityName);
                    botResponse.setEstimate(estimate);
//                    botResponse.setPrice(fetchPrice(source, destination, weight));
                    answer = String.format("ReadyForFulfillment; Intent: %s; Slots: %s", jsonNode.get("intentName").asText(""), jsonNode.get("slots").toString());
                    System.out.println(answer);
                }
                botResponse.setQuestion(requestText);
                botResponse.setAnswer(answer);
                botResponse.setId(id);
                logger.info(answer);
                return mapper.writeValueAsString(botResponse);
            } else {
                JsonNode errorMessage = mapper.readTree(responseStream).get("message");
                if (errorMessage != null) {
                    logger.info(errorMessage.asText());
                }
                List<Object> xAmznErrorType = response.getMetadata().get("x-amzn-ErrorType");
                if (!xAmznErrorType.isEmpty()) {
                    logger.info("xAmznErrorType: {}", xAmznErrorType.get(0));
                }
                List<Object> amznRequestId = response.getMetadata().get("x-amzn-RequestId");
                if (!amznRequestId.isEmpty()) {
                    logger.info("xAmznErrorType: {}", amznRequestId.get(0));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error in LexBotController#chat ", e);
        }
        return null;
    }

    private Integer fetchPrice(Integer source, Integer destination, Integer weight) {
        // http rest call to /estimate
        try {
            Integer price = 0;
            WebClient client = httpEstimateClient.getClient();
            final String requestParameters = String.format("{\"source\": \"%s\", \"destination\": \"%s\", \"weight\": \"%s\"}", source, destination, weight);

            final MetadataMap<String, String> headersMap = new MetadataMap<String, String>();
            headersMap.add("Content-Type", CONTENT_TYPE);
//            headersMap.add("Authorization", LexBotUtil.getAuthorizationHeader(id, requestParameters));
            client.headers(headersMap);

            Response response = client.post(requestParameters);
            InputStream responseStream = (InputStream) response.getEntity();
            if (response.getStatus() == 200) {
                // Call /estimate API
            } else {
                JsonNode errorMessage = mapper.readTree(responseStream).get("message");
                if (errorMessage != null) {
                    logger.info(errorMessage.asText());
                }
            }
            return price;
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error in LexBotController#fetchPrice ", e);
        }
        return null;
    }
}
