package com.karenoganesian.civicflow.teams.application;

import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import com.karenoganesian.civicflow.teams.api.dto.CreateTeamRequest;
import com.karenoganesian.civicflow.teams.api.dto.TeamResponse;
import com.karenoganesian.civicflow.teams.api.dto.UpdateTeamRequest;
import com.karenoganesian.civicflow.teams.domain.Team;
import com.karenoganesian.civicflow.teams.persistence.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getActiveTeams() {
        return teamRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(TeamResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAllByOrderByNameAsc()
                .stream()
                .map(TeamResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Team getTeamEntity(UUID id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
    }

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {
        if (teamRepository.findByNameIgnoreCase(request.name()).isPresent()) {
            throw new IllegalArgumentException("A team with name '" + request.name() + "' already exists");
        }

        Team team = new Team(
                null,
                request.name().trim(),
                request.description(),
                request.active() != null ? request.active() : true
        );

        return TeamResponse.from(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse updateTeam(UUID id, UpdateTeamRequest request) {
        Team team = getTeamEntity(id);

        if (request.name() != null && !request.name().isBlank()) {
            team.setName(request.name().trim());
        }
        if (request.description() != null) {
            team.setDescription(request.description());
        }
        if (request.active() != null) {
            team.setActive(request.active());
        }

        return TeamResponse.from(teamRepository.save(team));
    }
}
