export interface Documents {
    id: number | string; // Use string for compatibility with Dropbox IDs
    name: string;
    document: string; // Base64 encoded string
    type: string;
    user_id: number;
    size: number;
    folder_id?: number; // Optional field for folder association
    date_created: Date;
    path_lower: string;
    path_display: string;
    client_modified: Date;
    server_modified: Date;
    content_hash: string;
    tags?: string[]; // Optional field for tags
}

