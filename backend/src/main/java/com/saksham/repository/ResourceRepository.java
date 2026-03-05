package com.saksham.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.saksham.entity.Resource;
import com.saksham.entity.ResourceType;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, UUID>{
    List<Resource> findByIsActiveTrue();
    List<Resource> findByCategoryAndIsActiveTrue(String category);
    List<Resource> findByTypeAndIsActiveTrue(ResourceType type);
}
