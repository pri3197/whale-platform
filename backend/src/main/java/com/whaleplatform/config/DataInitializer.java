package com.whaleplatform.config;

import com.whaleplatform.model.Sighting;
import com.whaleplatform.repository.SightingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(SightingRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new Sighting("Humpback Whale", 20.7984, -156.3319, LocalDateTime.now().minusDays(1), "Alice", "Breaching near Maui"),
                        new Sighting("Blue Whale", 36.6226, -122.0163, LocalDateTime.now().minusDays(2), "Bob", "Monterey Bay feeding"),
                        new Sighting("Orca", 48.5159, -123.1524, LocalDateTime.now().minusHours(5), "Charlie", "San Juan Islands pod"),
                        new Sighting("Sperm Whale", -38.2500, 142.1167, LocalDateTime.now().minusDays(3), "David", "Southern Ocean deep dive"),
                        new Sighting("Gray Whale", 27.9715, -114.2405, LocalDateTime.now(), "Eva", "Baja California lagoon")
                ));
            }
        };
    }
}
