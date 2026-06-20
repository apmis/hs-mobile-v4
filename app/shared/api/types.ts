// Generic interface for FeathersJS paginated responses
export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

// Generic interface for standard FeathersJS errors
export interface ApiError {
  name: string;
  message: string;
  code: number;
  className: string;
  errors?: Record<string, any>;
}

// You can add more global shared types here over time
