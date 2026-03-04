export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}
