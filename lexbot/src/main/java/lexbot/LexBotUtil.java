package lexbot;

import org.apache.geronimo.mail.util.Hex;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static lexbot.CommonConstants.*;

class LexBotUtil {

    static String getAuthorizationHeader(String userID, String requestParameters) {
        try {
            final String canonicalUri = String.format("/bot/%s/alias/%s/user/%s/%s/", BOT_NAME, BOT_ALIAS, userID, POST_ACTION);
            final String canonicalQueryString = "";
            final String signedHeaders = "content-type;host;x-amz-date";

            final String payloadHash = hexEncode(sha256Hash(requestParameters));
            final ZonedDateTime utcNow = Instant.now().atZone(ZoneOffset.UTC);// Date for headers and the credential string
            final String amzDate = utcNow.format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
            final String dateStamp = utcNow.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            final String canonicalHeaders = String.format("content-type:%s\nhost:%s\nx-amz-date:%s\n", CONTENT_TYPE, HOST, amzDate);
            final String canonicalRequest = String.format("%s\n%s\n%s\n%s\n%s\n%s", METHOD, canonicalUri, canonicalQueryString, canonicalHeaders, signedHeaders, payloadHash);
            final String credentialScope = String.format("%s/%s/%s/aws4_request", dateStamp, REGION, SERVICE);
            final String canonicalRequestHash = hexEncode(sha256Hash(canonicalRequest));
            final String stringToSign = String.format("%s\n%s\n%s\n%s", ALGORITHM, amzDate, credentialScope, canonicalRequestHash);
            final byte[] signatureKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, SERVICE);
            final String signature = hexEncode(HmacSHA256(stringToSign, signatureKey));
            final String authorizationHeader = String.format("%s Credential=%s/%s, SignedHeaders=%s, Signature=%s", ALGORITHM, ACCESS_KEY, credentialScope, signedHeaders, signature);
            return authorizationHeader;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static byte[] sha256Hash(String value) throws NoSuchAlgorithmException {
        return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String hexEncode(byte[] data) {
        return new String(Hex.encode(data));
    }

    //Source: http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-java
    private static byte[] HmacSHA256(String data, byte[] key) throws Exception {
        String algorithm = "HmacSHA256";
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(key, algorithm));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    private static byte[] getSignatureKey(String key, String dateStamp, String regionName, String serviceName) throws Exception {
        byte[] kSecret = ("AWS4" + key).getBytes(StandardCharsets.UTF_8);
        byte[] kDate = HmacSHA256(dateStamp, kSecret);
        byte[] kRegion = HmacSHA256(regionName, kDate);
        byte[] kService = HmacSHA256(serviceName, kRegion);
        byte[] kSigning = HmacSHA256("aws4_request", kService);
        return kSigning;
    }

    static String getAmzDate() {
        final ZonedDateTime utcNow = Instant.now().atZone(ZoneOffset.UTC);
        return utcNow.format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
    }
}
