package com.whaleplatform.controller;

import com.whaleplatform.model.Sighting;
import com.whaleplatform.repository.SightingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sightings")
public class SightingController {

    @Autowired
    private SightingRepository sightingRepository;

    @GetMapping
    public List<Sighting> getAllSightings() {
        return sightingRepository.findAll();
    }

    @PostMapping
    public Sighting createSighting(@RequestBody Sighting sighting) {
        return sightingRepository.save(sighting);
    }
}
