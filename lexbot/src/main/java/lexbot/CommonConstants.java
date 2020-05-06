package lexbot;

class CommonConstants {
    static String ACCESS_KEY = "AWS_ACCESS_KEY_ID"; // Put here user's AWS_ACCESS_KEY_ID
    static String SECRET_KEY = "AWS_SECRET_ACCESS_KEY"; // Put here user's AWS_SECRET_ACCESS_KEY

    static String BOT_NAME = "DriveTime";
    static String BOT_ALIAS = "BookInstructor";
    static String POST_ACTION = "text";

    static String CONTENT_TYPE = "application/json";
    static String ALGORITHM = "AWS4-HMAC-SHA256";

    static String METHOD = "POST";
    static String SERVICE = "lex";
    static String HOST = "runtime.lex.us-east-1.amazonaws.com";
    static String END_POINT = "https://runtime.lex.us-east-1.amazonaws.com/";
    static String ESTIMATE_API = "localhost:8080";
    static String REGION = "us-east-1";
}
