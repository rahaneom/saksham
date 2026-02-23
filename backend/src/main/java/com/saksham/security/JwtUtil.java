
package com.saksham.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

import org.springframework.stereotype.Component;


@Component
public class JwtUtil {
    private final String SECRET="mySuperSecretKeyForJwtAuthenticationThatIsAtLeast32CharactersLong";   
    private final long EXPIRATION_TIME=1000*60*60*24; // 10 hours
    private final Key key=Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email, String role){
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis()+EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token){
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token){
        return (String) extractAllClaims(token).get("role");
    }

    public boolean validateToken(String token, String email){
        final String extractedEmail=extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token){
        return extractAllClaims(token).getExpiration().before(new java.util.Date());
    }

    private Claims extractAllClaims(String token){
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }

}

