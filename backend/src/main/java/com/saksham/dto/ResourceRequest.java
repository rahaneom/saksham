package com.saksham.dto;

import lombok.*;
import com.saksham.entity.ResourceType;

@Getter
@Setter
@NoArgsConstructor  
@AllArgsConstructor
@Builder
public class ResourceRequest {
    private String title;
    private String description;
    private ResourceType type;
    private String category;
    private String fileUrl;
}
