export class ApiResponse<T> {
    data?: T;
    message: string;

    constructor(message: string, data?: T) {
        this.data = data;
        this.message = message;
    }
}