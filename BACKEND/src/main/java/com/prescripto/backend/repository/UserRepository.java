package com.prescripto.backend.repository;

import com.prescripto.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * USER REPOSITORY
 * ================
 * Database operations for users table
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(String role);
}