package com.saksham.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.saksham.repository.ResourceRepository;
import com.saksham.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import com.saksham.dto.ResourceRequest;
import com.saksham.entity.Resource;
import com.saksham.entity.User;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public String addResource(ResourceRequest request){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User counsellor = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found!!"));
        Resource resource=Resource.builder()
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .type(request.getType())
                        .category(request.getCategory())
                        .fileUrl(request.getFileUrl())
                        .createdBy(counsellor)
                        .build();
        
        resourceRepository.save(resource);
        return "Resource Added Successfully";
        
    }
    public List<Resource> getAllResources(){
        return resourceRepository.findByIsActiveTrue();
    }

    public String deleteResource(UUID id){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found!!"));
        Resource resource=resourceRepository.findById(id).orElseThrow(()-> new RuntimeException("Resource not found!!"));
        if(!resource.getCreatedBy().getId().equals(user.getId())){
            throw new RuntimeException("Unauthorized to delete this resource!!");
        }
        resource.setActive(false);
        resourceRepository.save(resource);
        return "Resource deleted successfully";

    }
}
