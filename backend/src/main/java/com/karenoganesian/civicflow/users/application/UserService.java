package com.karenoganesian.civicflow.users.application;

import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import com.karenoganesian.civicflow.security.JwtTokenProvider;
import com.karenoganesian.civicflow.security.UserPrincipal;
import com.karenoganesian.civicflow.teams.domain.Team;
import com.karenoganesian.civicflow.teams.persistence.TeamRepository;
import com.karenoganesian.civicflow.users.api.dto.AuthResponse;
import com.karenoganesian.civicflow.users.api.dto.CreateUserRequest;
import com.karenoganesian.civicflow.users.api.dto.LoginRequest;
import com.karenoganesian.civicflow.users.api.dto.UpdateUserRequest;
import com.karenoganesian.civicflow.users.api.dto.UserResponse;
import com.karenoganesian.civicflow.users.domain.User;
import com.karenoganesian.civicflow.users.domain.UserRole;
import com.karenoganesian.civicflow.users.persistence.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserService(UserRepository userRepository, TeamRepository teamRepository,
                       PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = getUserEntity(principal.getId());

        return new AuthResponse(token, UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal principal) {
        User user = getUserEntity(principal.getId());
        return UserResponse.from(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByDisplayNameAsc()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getTechniciansForTeam(UUID teamId) {
        return userRepository.findByTeamIdAndActiveTrue(teamId)
                .stream()
                .filter(u -> u.getRole() == UserRole.TECHNICIAN)
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public User getUserEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("A user with email '" + request.email() + "' already exists");
        }

        Team team = null;
        if (request.teamId() != null) {
            team = teamRepository.findById(request.teamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.teamId()));
        }

        User user = new User(
                null,
                request.email().trim().toLowerCase(),
                request.displayName().trim(),
                passwordEncoder.encode(request.password()),
                request.role(),
                team,
                request.active() != null ? request.active() : true
        );

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = getUserEntity(id);

        if (request.displayName() != null && !request.displayName().isBlank()) {
            user.setDisplayName(request.displayName().trim());
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }
        if (request.teamId() != null) {
            Team team = teamRepository.findById(request.teamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.teamId()));
            user.setTeam(team);
        }
        if (request.active() != null) {
            user.setActive(request.active());
        }

        return UserResponse.from(userRepository.save(user));
    }
}
