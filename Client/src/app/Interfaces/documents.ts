export interface Documents {
    id: number;
    name: string;
    document: string; // Base64 encoded string
    type: string;
    user_id: number;
    size: number;
    folder_id?: number; // Optional field for folder association
    date_created: Date;
}
