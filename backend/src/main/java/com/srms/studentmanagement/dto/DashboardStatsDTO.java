package com.srms.studentmanagement.dto;

public class DashboardStatsDTO {
    private long totalStudents;
    private double averageMarks;
    private double highestMarks;
    private double lowestMarks;
    private long passCount;
    private long failCount;
    private double passPercentage;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalStudents, double averageMarks, double highestMarks, double lowestMarks, long passCount, long failCount, double passPercentage) {
        this.totalStudents = totalStudents;
        this.averageMarks = averageMarks;
        this.highestMarks = highestMarks;
        this.lowestMarks = lowestMarks;
        this.passCount = passCount;
        this.failCount = failCount;
        this.passPercentage = passPercentage;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public double getHighestMarks() {
        return highestMarks;
    }

    public void setHighestMarks(double highestMarks) {
        this.highestMarks = highestMarks;
    }

    public double getLowestMarks() {
        return lowestMarks;
    }

    public void setLowestMarks(double lowestMarks) {
        this.lowestMarks = lowestMarks;
    }

    public long getPassCount() {
        return passCount;
    }

    public void setPassCount(long passCount) {
        this.passCount = passCount;
    }

    public long getFailCount() {
        return failCount;
    }

    public void setFailCount(long failCount) {
        this.failCount = failCount;
    }

    public double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(double passPercentage) {
        this.passPercentage = passPercentage;
    }
}
