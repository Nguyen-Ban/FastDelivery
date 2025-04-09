export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: object;
    nextStep?: string;
    error?: string;
}