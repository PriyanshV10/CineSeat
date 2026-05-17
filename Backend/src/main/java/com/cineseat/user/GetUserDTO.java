package com.cineseat.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUserDTO {
    private Long id;
    private String email;
    private String name;
    private User.Role role;
    private User.AuthProvider authProvider;
    private String phoneNumber;
    private String avatarUrl;
}
