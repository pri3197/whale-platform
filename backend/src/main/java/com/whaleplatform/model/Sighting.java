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

    public Sighting() {
    }

    public Sighting(String species, Double latitude, Double longitude, LocalDateTime sightingDate, String observerName, String comments) {
        this.species = species;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sightingDate = sightingDate;
        this.observerName = observerName;
        this.comments = comments;
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
}
