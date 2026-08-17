package com.karenoganesian.civicflow.teams.web;

import com.karenoganesian.civicflow.teams.api.dto.TeamResponse;
import com.karenoganesian.civicflow.teams.application.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@Tag(name = "Staff Teams", description = "Operational endpoints for listing service teams for assignments")
public class StaffTeamController {

    private final TeamService teamService;

    public StaffTeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    @Operation(summary = "List active municipal teams for triage & assignment")
    public ResponseEntity<List<TeamResponse>> getActiveTeams() {
        return ResponseEntity.ok(teamService.getActiveTeams());
    }
}
