export interface Folder {
    id: number;
    name: string;
    description: string;
    user_id: number;
    date_created: Date;
    updated_at: Date;
    tags?: string[]; // Optional field for tags
    path_lower?: string; // Optional field for Dropbox path
    path_display?: string; // Optional field for Dropbox display path
}
