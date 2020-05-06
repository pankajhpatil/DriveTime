package lexbot;

class Estimate {
    private Integer plan;
    private String startDate;
    private String endDate;
    private Integer timeSlot;
    private String cityName;

    public Integer getPlan() {
        return plan;
    }

    public Integer getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(Integer timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    void setPlan(Integer plan) {
        this.plan = plan;
    }

    public String getStartDate() {
        return startDate;
    }

    void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
