package com.saksham.controller;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/secure")
    public String secure() {
        return "You accessed protected route!";
    }
}