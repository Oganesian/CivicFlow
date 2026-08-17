package com.karenoganesian.civicflow.teams.persistence;

import com.karenoganesian.civicflow.teams.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    Optional<Team> findByNameIgnoreCase(String name);
    List<Team> findByActiveTrueOrderByNameAsc();
    List<Team> findAllByOrderByNameAsc();
}
