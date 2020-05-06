package lexbot;

public class LexBotResponse {
    private String question;
    private String answer;
    private String id;
    private Estimate estimate;
    private Boolean readyForFulfilment;
//    private String price;

    public String getQuestion() {
        return question;
    }

    void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getId() {
        return id;
    }

    void setId(String id) {
        this.id = id;
    }

    public Estimate getEstimate() { return estimate; }

    void setEstimate(Estimate estimate) { this.estimate = estimate; }

    public Boolean getReadyForFulfilment() { return readyForFulfilment; }

    void setReadyForFulfilment(Boolean readyForFulfilment) { this.readyForFulfilment = readyForFulfilment; }

//    public String getPrice() { return price; }
//
//    void setPrice(String price) { this.price = price; }
 }
