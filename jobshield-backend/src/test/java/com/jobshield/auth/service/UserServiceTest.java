package com.jobshield.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jobshield.auth.dto.LoginRequest;
import com.jobshield.auth.dto.RegisterRequest;
import com.jobshield.auth.entity.User;
import com.jobshield.auth.repository.UserRepository;
import com.jobshield.auth.service.impl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private RegisterRequest registerRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("jane.doe@example.com");
        registerRequest.setPassword("securePassword123");
        registerRequest.setPhoneNumber("+1234567890");

        testUser = new User();
        testUser.setUserId(1L);
        testUser.setFirstName("Jane");
        testUser.setLastName("Doe");
        testUser.setEmail("jane.doe@example.com");
        testUser.setPasswordHash("hashed_password_abc");
        testUser.setRole("USER");
        testUser.setAccountStatus("ACTIVE");
    }

    @Test
    @DisplayName("Should register new user successfully with encrypted password and default USER role")
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail("jane.doe@example.com")).thenReturn(false);
        when(passwordEncoder.encode("securePassword123")).thenReturn("hashed_password_abc");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User createdUser = userService.registerUser(registerRequest);

        assertNotNull(createdUser);
        assertEquals("jane.doe@example.com", createdUser.getEmail());
        assertEquals("USER", createdUser.getRole());
        assertEquals("ACTIVE", createdUser.getAccountStatus());
        assertEquals("hashed_password_abc", createdUser.getPasswordHash());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when attempting to register with an existing email")
    void testRegisterUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("jane.doe@example.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(registerRequest);
        });

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate user successfully with correct credentials")
    void testLoginUser_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("jane.doe@example.com");
        loginRequest.setPassword("securePassword123");

        when(userRepository.findByEmail("jane.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("securePassword123", "hashed_password_abc")).thenReturn(true);

        User authenticatedUser = userService.loginUser(loginRequest);

        assertNotNull(authenticatedUser);
        assertEquals("jane.doe@example.com", authenticatedUser.getEmail());
    }

    @Test
    @DisplayName("Should reject login when password does not match")
    void testLoginUser_InvalidPassword_ThrowsException() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("jane.doe@example.com");
        loginRequest.setPassword("wrongPassword");

        when(userRepository.findByEmail("jane.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "hashed_password_abc")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.loginUser(loginRequest);
        });

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    @DisplayName("Should reject login when email does not exist")
    void testLoginUser_UserNotFound_ThrowsException() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("password");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.loginUser(loginRequest);
        });

        assertEquals("Invalid email or password", exception.getMessage());
    }
}
