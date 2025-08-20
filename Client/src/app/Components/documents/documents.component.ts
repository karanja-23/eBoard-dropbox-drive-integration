import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DocumentsService } from '../../Services/documents.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { DropboxService } from '../../Services/dropbox-service.service';
import { PopoverModule } from 'primeng/popover';
import { GoogleDriveService } from '../../Services/google-drive.service';
interface Document {
  id: number;
  name: string;
  description: string;
  type: string;
  document: string;
  date_created: string;
  size: number;
  user_id: number;
  path_lower?: string; // Optional path for Dropbox documents
  tags?: string[]; // Optional tags for local or dropbox
}

@Component({
  selector: 'app-documents',
  imports: [
    TableModule, 
    CommonModule, 
    RouterModule, 
    DialogModule, 
    ButtonModule, 
    FileUploadModule, 
    FormsModule,
    ToastModule,
    PopoverModule
  ],
  providers: [
    MessageService], 
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  currentView: 'list' | 'grid' = 'list';
  documents: Document[] = [];
  
  
  showAddDocumentDialog: boolean = false;
  modalClass: string = 'modal';
  isSubmitting: boolean = false;
  selectedFile: File | null = null;

  dropboxSync: boolean = false;
  driveSync: boolean = false;

  dropboxDocuments: any[] = [];
  dropBoxSynced: any[] = [];

  googleDriveDocuments: any[] = [];

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private dropboxService: DropboxService,
    private driveService: GoogleDriveService
  ) {
    
  }
  async ngOnInit() {
    await this.getUser(1); // Replace with actual user ID
    await this.getDropboxDocuments();
    await this.getDriveDocuments();
    await this.updateCombinedDocuments();

  }

  setView(view: 'list' | 'grid') {
    this.currentView = view;
  }
  
async updateCombinedDocuments(): Promise<void> {
  const dropboxDocs = this.dropboxDocuments || [];
  const localDocs = this.documents || [];
  const driveDocs = this.googleDriveDocuments || [];

  console.log('Input documents:', {
    local: localDocs.length,
    dropbox: dropboxDocs.length,
    drive: driveDocs.length
  });

  // Create a map for quick lookup by name and size
  const docMap = new Map<string, any>();

  // Helper function to normalize size (Google Drive returns size as string)
  const normalizeSize = (size: any): number => {
    if (typeof size === 'string') {
      return parseInt(size) || 0;
    }
    return size || 0;
  };

  // Helper function to generate consistent key
  const generateKey = (doc: any): string => {
    const name = doc.name || doc.title || doc.filename || 'unknown';
    const size = normalizeSize(doc.size || doc.bytes);
    return `${name}_${size}`;
  };

  // Add local docs first
  localDocs.forEach(doc => {
    const key = generateKey(doc);
    doc.tags = ['local'];
    docMap.set(key, doc);
  });

  // Add dropbox docs, merge tags if already present
  dropboxDocs.forEach(doc => {
    const key = generateKey(doc);
    if (docMap.has(key)) {
      // Merge tags
      const existingDoc = docMap.get(key);
      if (!existingDoc.tags.includes('dropbox')) {
        existingDoc.tags.push('dropbox');
      }
    } else {
      doc.tags = ['dropbox'];
      docMap.set(key, doc);
    }
  });

  // Add Google Drive docs, merge tags if already present
  driveDocs.forEach(doc => {
    const key = generateKey(doc);
    console.log(`Processing Drive doc: ${doc.name} (${doc.size} bytes) - key: ${key}`);
    
    if (docMap.has(key)) {
      // Merge tags
      const existingDoc = docMap.get(key);
      if (!existingDoc.tags.includes('drive')) {
        existingDoc.tags.push('drive');
      }
      console.log(`Merged with existing doc - tags now: ${existingDoc.tags}`);
    } else {
      doc.tags = ['drive'];
      docMap.set(key, doc);
      console.log(`Added new Drive doc`);
    }
  });

  // Set the combined array and sort by name
  this.dropBoxSynced = this.sortDocumentsByName(Array.from(docMap.values()));
  
  // Enhanced logging
  const tagStats = {
    local: 0,
    dropbox: 0,
    drive: 0,
    localOnly: 0,
    dropboxOnly: 0,
    driveOnly: 0,
    multiple: 0
  };

  this.dropBoxSynced.forEach(doc => {
    if (doc.tags.includes('local')) tagStats.local++;
    if (doc.tags.includes('dropbox')) tagStats.dropbox++;
    if (doc.tags.includes('drive')) tagStats.drive++;
    
    if (doc.tags.length === 1) {
      if (doc.tags[0] === 'local') tagStats.localOnly++;
      else if (doc.tags[0] === 'dropbox') tagStats.dropboxOnly++;
      else if (doc.tags[0] === 'drive') tagStats.driveOnly++;
    } else {
      tagStats.multiple++;
    }
  });

  console.log('Document combination stats:', {
    input: {
      local: localDocs.length,
      dropbox: dropboxDocs.length,
      drive: driveDocs.length,
    },
    output: {
      combined: this.dropBoxSynced.length,
      ...tagStats,
      duplicates: (localDocs.length + dropboxDocs.length + driveDocs.length) - this.dropBoxSynced.length
    }
  });

  // Show sample of drive-tagged documents for verification
  const driveTaggedDocs = this.dropBoxSynced.filter(doc => doc.tags.includes('drive'));
  console.log(`Drive-tagged documents (${driveTaggedDocs.length}):`, 
    driveTaggedDocs.slice(0, 3).map(doc => ({
      name: doc.name,
      size: normalizeSize(doc.size),
      tags: doc.tags,
      mimeType: doc.mimeType
    }))
  );
}
private sortDocumentsByName(documents: any[]): any[] {
  return documents.sort((a, b) => {
    const nameA = (a.name || a.title || '').toLowerCase();
    const nameB = (b.name || b.title || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
async getDriveDocuments(): Promise<void> {
  try {
    if (!this.driveService.isAuthenticated) {
      console.error('Not authenticated with Google Drive');
      return;
    }

    console.log('Starting to load Google Drive files...');

    const result = await this.driveService.listAllFiles({
      progressCallback: (current: number) => {
        console.log(`Progress: ${current} files loaded`);
      }
    });

    // Process each document to add normalized properties including type
    this.googleDriveDocuments = result.files.map((doc: any) => {
      return {
        ...doc,
        // Add the type property using your existing method
        type: this.getDriveFileType(doc),
        // Add normalized size
        size: this.normalizeSize(doc.size),
        // Add source identifier
        source: 'drive'
      };
    });
    
    console.log(`Successfully loaded ${this.googleDriveDocuments.length} files`);
    console.log('Sample Drive files with types:', 
      this.googleDriveDocuments.slice(0, 5).map(f => ({
        name: f.name,
        type: f.type,
        mimeType: f.mimeType,
        size: f.size,
        id: f.id
      }))
    );
    
    // Call updateCombinedDocuments after loading Drive files
    await this.updateCombinedDocuments();
    
    console.log('Google Drive documents loaded and combined successfully');

  } catch (error) {
    console.error('Failed to list all files:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load Google Drive documents'
    });
  } 
}

// Helper method to normalize size (add this if you don't have it)
private normalizeSize(size: any): number {
  if (typeof size === 'string') {
    return parseInt(size) || 0;
  }
  return size || 0;
}
  onDocumentClick(documentId: number) {
    this.router.navigate(['/documents', documentId]);
  }
  async getDropboxDocuments(): Promise<void> {
  try {
    this.dropboxDocuments = await this.dropboxService.listFiles();
    console.log('Dropbox documents:', this.dropboxDocuments);
  } catch (error) {
    console.log('Error fetching Dropbox documents:', error);
    this.dropboxDocuments = []; // Set to empty array on error
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch Dropbox documents'
    });
  }
}
  onFileUpload(event:any){
    const file = event.files[0];
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('user_id', '1'); // to replace with actual user ID
    formData.append('document', file);
    formData.append('type', file.type);
    formData.append('size', file.size.toString()); 
    formData.append('folder_id', '1'); // Replace with actual folder ID if needed
    
    this.downloadDocument(formData);
    this.selectedFile = null; 
    
  }
  async downloadDocument(formData: FormData): Promise<void> {
  try {
    await this.documentsService.addDocument(formData);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Document saved locally from Dropbox'
    });

    // Refresh data to show the document now has both 'dropbox' and 'local' tags
    await this.getUser(1);
    await this.getDropboxDocuments();
    await this.updateCombinedDocuments();

    console.log('✅ Document saved locally and UI refreshed');

  } catch (error: any) {
    console.error('❌ Error saving document:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save document to local database'
    });
  }
}
  async getUser(userId: number): Promise<any> {
    try {
      const user = await this.documentsService.getUser(userId);
      console.log('User data loaded:', user);
      
      this.documents = user.documents || [];
      this.dropboxSync = user.dropbox_sync || false;
      this.driveSync = user.drive_sync || false;
      
      console.log('Documents set:', this.documents);
      console.log('Dropbox sync enabled:', this.dropboxSync);
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      this.documents = [];
      throw error;
    }
  }
  toggleDropboxSync() {
  this.dropboxSync = !this.dropboxSync;
  // Add actual sync logic here
}

toggleDriveSync() {
  this.driveSync = !this.driveSync;
  // Add actual sync logic here
}
async setTags(docs:any[]){
  docs.forEach((doc:any) => {
    if('client_modified' in doc) {
      doc.tags = ['dropbox'];
    }
    else if('date_created' in doc) {
      doc.tags = ['local'];
    }
    else {
      doc.tags = [];
    }
  });
}
private sanitizeFileName(fileName: string): string {
  // Remove or replace characters that Dropbox doesn't allow
  let cleaned = fileName
    .replace(/[<>:"|?*]/g, '_') // Replace invalid characters with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .trim();

  // Ensure file has an extension
  if (!cleaned.includes('.')) {
    cleaned += '.pdf'; // Default to PDF if no extension
  }

  // Limit length (Dropbox has a 255 character limit)
  if (cleaned.length > 255) {
    const ext = cleaned.substring(cleaned.lastIndexOf('.'));
    cleaned = cleaned.substring(0, 255 - ext.length) + ext;
  }

  return cleaned;
}

async syncToDropbox(document: Document): Promise<void> {
  try {
    if (!this.dropboxSync) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning', 
        detail: 'Dropbox sync is not enabled'
      });
      return;
    }

    if (!document?.document) {
      throw new Error('Document content is missing');
    }

    const cleanFileName = this.sanitizeFileName(document.name);
    const dropboxPath = `/${cleanFileName}`;

    let fileBlob: Blob;
    
    if (document.document.includes('base64,')) {
      // Data URL format
      const base64Data = document.document.split('base64,')[1];
      fileBlob = this.base64ToBlob(base64Data, document.type);
    } else if (document.document.startsWith('data:')) {
      // Other data URL format
      const response = await fetch(document.document);
      fileBlob = await response.blob();
    } else {
      // Raw base64
      fileBlob = this.base64ToBlob(document.document, document.type);
    }

    if (!fileBlob || fileBlob.size === 0) {
      throw new Error('Failed to create valid file from document content');
    }

    await this.dropboxService.uploadFile(fileBlob, dropboxPath);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Document "${cleanFileName}" synced to Dropbox successfully`
    });

    // Refresh data
    await this.getDropboxDocuments();
    await this.updateCombinedDocuments();

  } catch (error: any) {
    console.error('Dropbox sync failed:', error.message || error);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Sync Failed',
      detail: error.message || 'Failed to sync document to Dropbox'
    });
  }
}

private base64ToBlob(base64: string, contentType: string): Blob {
  try {
    const cleanBase64 = base64.replace(/\s/g, '');
    
    if (!cleanBase64) {
      throw new Error('Empty base64 content');
    }
    
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType || 'application/octet-stream' });
    
  } catch (error: any) {
    console.error('Base64 conversion failed:', error.message);
    throw new Error('Invalid document format');
  }
}
async downloadToLocal(document: Document): Promise<void> {
  try {
    // Validate document data
    if (!document.path_lower) {
      throw new Error('Document path is missing');
    }

    // Try SDK method first, fallback to direct API
    let fileBlob: Blob;
    try {
      fileBlob = await this.dropboxService.downloadFile(document.path_lower);
    } catch (sdkError) {
      fileBlob = await this.dropboxService.downloadFileDirectAPI(document.path_lower);
    }
    
    if (!fileBlob) {
      throw new Error('No file data received');
    }

    if (fileBlob.size === 0) {
      throw new Error('Downloaded file is empty');
    }

    // Create FormData for local storage
    const formData = new FormData();
    formData.append('name', document.name);
    formData.append('user_id', '1'); // Replace with actual user ID
    
    // Determine the correct MIME type
    const mimeType = this.getFileType(document.name);
    
    // Create File object from the downloaded blob
    const file = new File([fileBlob], document.name, { 
      type: mimeType 
    });
    
    formData.append('document', file);
    formData.append('type', mimeType);
    formData.append('size', fileBlob.size.toString());
    formData.append('description', `Downloaded from Dropbox: ${document.name}`);

    // Save to local database
    await this.downloadDocument(formData);

  } catch (error: any) {
    let errorMessage = 'Failed to download document from Dropbox';
    
    if (error.message === 'Not authenticated') {
      errorMessage = 'Please reconnect to Dropbox';
    } else if (error.message.includes('not found') || error.message.includes('path/not_found')) {
      errorMessage = 'File not found in Dropbox';
    } else if (error.message.includes('empty')) {
      errorMessage = 'The file appears to be empty or corrupted';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.messageService.add({
      severity: 'error',
      summary: 'Download Failed',
      detail: errorMessage
    });
  }
}

// Helper method to determine file type from filename
private getFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    'csv': 'text/csv',
    
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'svg': 'image/svg+xml',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    
    // Others
    'json': 'application/json',
    'xml': 'text/xml',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript'
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

private getDriveFileType(document: any): string {
  // Handle different ways files store type information
  if (document.mimeType) {
    // Google Drive uses mimeType - return user-friendly names
    if (document.mimeType === 'application/vnd.google-apps.document') return 'Google Doc';
    if (document.mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheet';
    if (document.mimeType === 'application/vnd.google-apps.presentation') return 'Google Slides';
    if (document.mimeType === 'application/vnd.google-apps.form') return 'Google Form';
    if (document.mimeType === 'application/vnd.google-apps.drawing') return 'Google Drawing';
    if (document.mimeType === 'application/pdf') return 'PDF';
    if (document.mimeType === 'text/plain') return 'Text';
    if (document.mimeType.startsWith('image/')) return 'Image';
    if (document.mimeType.startsWith('video/')) return 'Video';
    if (document.mimeType.startsWith('audio/')) return 'Audio';
    
    // For other MIME types, extract the subtype and make it readable
    const parts = document.mimeType.split('/');
    if (parts.length > 1) {
      const subtype = parts[1];
      // Convert common subtypes to readable names
      if (subtype.includes('word')) return 'Word Document';
      if (subtype.includes('excel') || subtype.includes('spreadsheet')) return 'Excel';
      if (subtype.includes('powerpoint') || subtype.includes('presentation')) return 'PowerPoint';
      if (subtype.includes('zip')) return 'ZIP Archive';
      
      // Capitalize first letter and remove technical prefixes
      return subtype.replace(/^(vnd\.|x-|ms-)/, '').replace(/^\w/, (c: string) => c.toUpperCase());
    }
    
    return document.mimeType;
  }
  
  if (document.path_lower) {
    // Dropbox uses path_lower, extract extension
    const extension = document.path_lower.split('.').pop()?.toLowerCase();
    return extension ? extension.toUpperCase() : 'Unknown';
  }
  
  if (document.type) {
    // Local files use 'type' - convert MIME type to readable format
    if (document.type.startsWith('application/pdf')) return 'PDF';
    if (document.type.startsWith('text/')) return 'Text';
    if (document.type.startsWith('image/')) return 'Image';
    if (document.type.startsWith('video/')) return 'Video';
    if (document.type.startsWith('audio/')) return 'Audio';
    
    const parts = document.type.split('/');
    return parts.length > 1 ? parts[1].toUpperCase() : 'Unknown';
  }
  
  // Fallback: try to get from filename extension
  const name = document.name || '';
  const extension = name.split('.').pop()?.toLowerCase();
  return extension ? extension.toUpperCase() : 'Unknown';
}


private extensionToMimeType(extension: string | undefined): string {
  if (!extension) return 'application/octet-stream';
  
  const mimeTypes: { [key: string]: string } = {
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    'csv': 'text/csv',
    
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'svg': 'image/svg+xml',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    
    // Others
    'json': 'application/json',
    'xml': 'text/xml',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

async syncToGoogleDrive(document: any): Promise<void> {
 
  try {
    if (!this.driveSync) {
      console.log('Google Drive sync is not enabled');
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning', 
        detail: 'Google Drive sync is not enabled'
      });
      return;
    }
    console.log('Syncing document to Google Drive:', document);
    if (!document?.document) {
      throw new Error('Document content is missing');
    }

    const cleanFileName = this.sanitizeFileName(document.name);
    
    let fileBlob: Blob;
    
    if (document.document.includes('base64,')) {
      // Data URL format
      const base64Data = document.document.split('base64,')[1];
      fileBlob = this.base64ToBlob(base64Data, document.type);
    } else if (document.document.startsWith('data:')) {
      // Other data URL format
      const response = await fetch(document.document);
      fileBlob = await response.blob();
    } else {
      // Raw base64
      fileBlob = this.base64ToBlob(document.document, document.type);
    }

    if (!fileBlob || fileBlob.size === 0) {
      throw new Error('Failed to create valid file from document content');
    }

    // Create File object from blob
    const file = new File([fileBlob], cleanFileName, { 
      type: document.type || 'application/octet-stream' 
    });

    // Upload to Google Drive
    const response = await this.driveService.uploadFile(file, cleanFileName);
    console.log('Google Drive upload response:', response);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Document "${cleanFileName}" synced to Google Drive successfully`
    });

    // Refresh data
    await this.getDriveDocuments();
    await this.updateCombinedDocuments();

  } catch (error: any) {
    console.error('Google Drive sync failed:', error.message || error);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Sync Failed',
      detail: error.message || 'Failed to sync document to Google Drive'
    });
  }
}
}