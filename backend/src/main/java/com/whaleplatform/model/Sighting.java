package com.whaleplatform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sightings")
public class Sighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String species;
    private Double latitude;
    private Double longitude;
    private LocalDateTime sightingDate;
    private String observerName;
    private String comments;

    private Double length;
    private Double breadth;
    private Integer approxAge;
    private Double predictedLat;
    private Double predictedLng;
    private Double actualLat;
    private Double actualLng;
    private String imageUrl;

    public Sighting() {
    }

    public Sighting(String species, Double latitude, Double longitude, LocalDateTime sightingDate, String observerName, String comments, Double length, Double breadth, Integer approxAge, Double predictedLat, Double predictedLng, Double actualLat, Double actualLng, String imageUrl) {
        this.species = species;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sightingDate = sightingDate;
        this.observerName = observerName;
        this.comments = comments;
        this.length = length;
        this.breadth = breadth;
        this.approxAge = approxAge;
        this.predictedLat = predictedLat;
        this.predictedLng = predictedLng;
        this.actualLat = actualLat;
        this.actualLng = actualLng;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocalDateTime getSightingDate() { return sightingDate; }
    public void setSightingDate(LocalDateTime sightingDate) { this.sightingDate = sightingDate; }
    public String getObserverName() { return observerName; }
    public void setObserverName(String observerName) { this.observerName = observerName; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public Double getLength() { return length; }
    public void setLength(Double length) { this.length = length; }
    public Double getBreadth() { return breadth; }
    public void setBreadth(Double breadth) { this.breadth = breadth; }
    public Integer getApproxAge() { return approxAge; }
    public void setApproxAge(Integer approxAge) { this.approxAge = approxAge; }
    public Double getPredictedLat() { return predictedLat; }
    public void setPredictedLat(Double predictedLat) { this.predictedLat = predictedLat; }
    public Double getPredictedLng() { return predictedLng; }
    public void setPredictedLng(Double predictedLng) { this.predictedLng = predictedLng; }
    public Double getActualLat() { return actualLat; }
    public void setActualLat(Double actualLat) { this.actualLat = actualLat; }
    public Double getActualLng() { return actualLng; }
    public void setActualLng(Double actualLng) { this.actualLng = actualLng; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
