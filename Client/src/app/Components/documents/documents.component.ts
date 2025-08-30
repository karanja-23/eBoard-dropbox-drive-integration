import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { LoadingComponent } from '../loading/loading.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';

interface Document {
  id: number;
  name: string;
  description: string;
  type: string;
  document: string;
  date_created: string;
  size: number;
  user_id: number;
  path_lower?: string;
  tags?: string[];
}

interface CloudFile {
  uniqueId: string;
  name: string;
  size: number;
  type: string;
  mimeType?: string;
  source: 'dropbox' | 'drive';
  path_lower?: string;
  id?: string;
  [key: string]: any;
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
    PopoverModule,
    LoadingComponent,
    CheckboxModule
  ],
  providers: [MessageService], 
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  currentView: 'list' | 'grid' = 'list';
  documents: Document[] = [];
  combinedDocuments: Document[] = [];
  filteredDocuments: Document[] = [];
  
  showAddDocumentDialog: boolean = false;
  showCloudSyncModal: boolean = false;
  modalClass: string = 'modal';
  isSubmitting: boolean = false;
  selectedFile: File | null = null;

  // Sync status from user preferences
  dropboxSync: boolean = false;
  driveSync: boolean = false;

  // Cloud document arrays
  dropboxDocuments: any[] = [];
  googleDriveDocuments: any[] = [];
  allCloudFiles: CloudFile[] = [];
  filteredCloudFiles: CloudFile[] = [];

  // Authentication status
  driveAuthenticated: boolean = false;

  // UI state
  isLoading: boolean = true;
  isLoadingCloudFiles: boolean = false;
  isSyncingFiles: boolean = false;
  isBrowser: boolean;

  // Search and filter state
  mainSearchTerm: string = '';
  cloudSearchTerm: string = '';
  showDropboxFiles: boolean = true;
  showDriveFiles: boolean = true;

  // Cloud file selection
  selectedCloudFiles: any[] = [];

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private dropboxService: DropboxService,
    private driveService: GoogleDriveService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    // Load local files by default
    await this.loadLocalDocuments();
    
    // Check authentication status for cloud services
    await this.checkAuthenticationStatus();
    
    this.isLoading = false;
  }

  ngAfterViewInit() {
    // No automatic modal showing - user clicks "Sync Cloud Files" button
  }

  private async loadLocalDocuments(): Promise<void> {
    try {
      console.log('Loading local documents...');
      await this.getUser(1);
      this.combinedDocuments = [...this.documents];
      this.filterDocuments();
      console.log(`Loaded ${this.documents.length} local documents`);
    } catch (error) {
      console.error('Error loading local documents:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load local documents'
      });
    }
  }

  async setShowCloudSyncModal(): Promise<void> {
    this.showCloudSyncModal = true;
    this.isLoadingCloudFiles = true;
    this.selectedCloudFiles = [];
    
    try {
      // Load cloud files
      await this.loadCloudFiles();
      this.filterCloudFiles();
    } catch (error) {
      console.error('Error loading cloud files:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load cloud files'
      });
    } finally {
      this.isLoadingCloudFiles = false;
    }
  }

  private async loadCloudFiles(): Promise<void> {
    const loadingPromises = [];

    // Load Dropbox files
    if (this.dropboxService) {
      loadingPromises.push(this.getDropboxDocuments());
    }

    // Load Google Drive files
    if (this.driveAuthenticated) {
      loadingPromises.push(this.getDriveDocuments());
    }

    await Promise.allSettled(loadingPromises);
    
    // Combine all cloud files with unique IDs
    this.allCloudFiles = [
      ...this.dropboxDocuments.map((doc, index) => ({
        ...doc,
        uniqueId: `dropbox_${index}_${doc.name}_${doc.size}`,
        source: 'dropbox' as const,
        type: this.getDropboxFileType(doc)
      })),
      ...this.googleDriveDocuments.map((doc, index) => ({
        ...doc,
        uniqueId: `drive_${index}_${doc.id}`,
        source: 'drive' as const,
        type: this.getDriveFileType(doc)
      }))
    ];

    console.log(`Loaded ${this.allCloudFiles.length} total cloud files`);
  }

  filterCloudFiles(): void {
    let filtered = this.allCloudFiles;

    // Filter by source
    filtered = filtered.filter(file => {
      if (!this.showDropboxFiles && file.source === 'dropbox') return false;
      if (!this.showDriveFiles && file.source === 'drive') return false;
      return true;
    });

    // Filter by search term
    if (this.cloudSearchTerm.trim()) {
      const searchLower = this.cloudSearchTerm.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchLower) ||
        file.type.toLowerCase().includes(searchLower)
      );
    }

    this.filteredCloudFiles = filtered;
  }

  filterDocuments(): void {
    if (!this.mainSearchTerm.trim()) {
      this.filteredDocuments = [...this.combinedDocuments];
      return;
    }

    const searchLower = this.mainSearchTerm.toLowerCase();
    this.filteredDocuments = this.combinedDocuments.filter(doc => 
      doc.name.toLowerCase().includes(searchLower) ||
      doc.type.toLowerCase().includes(searchLower) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  clearCloudSelection(): void {
    this.selectedCloudFiles = [];
  }

  cancelCloudSync(): void {
    this.showCloudSyncModal = false;
    this.selectedCloudFiles = [];
    this.cloudSearchTerm = '';
    this.showDropboxFiles = true;
    this.showDriveFiles = true;
  }

  async syncSelectedCloudFiles(): Promise<void> {
    if (this.selectedCloudFiles.length === 0) return;

    this.isSyncingFiles = true;
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const file of this.selectedCloudFiles) {
        try {
          if (file.source === 'dropbox') {
            await this.downloadToLocal(file as any);
          } else if (file.source === 'drive') {
            await this.downloadToLocalFromDrive(file.id);
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to sync file ${file.name}:`, error);
          errorCount++;
        }
      }

      // Show summary message
      if (successCount > 0) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sync Complete',
          detail: `Successfully synced ${successCount} file(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        });
      }

      if (errorCount > 0 && successCount === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Sync Failed',
          detail: `Failed to sync ${errorCount} file(s)`
        });
      }

      // Refresh documents and close modal
      await this.loadLocalDocuments();
      this.showCloudSyncModal = false;
      this.selectedCloudFiles = [];

    } catch (error) {
      console.error('Error during batch sync:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Sync Error',
        detail: 'An error occurred during file synchronization'
      });
    } finally {
      this.isSyncingFiles = false;
    }
  }

  isDocumentAlreadySynced(cloudFile: CloudFile): boolean {
    const normalizedCloudName = this.normalizeFileName(cloudFile.name);
    const cloudSize = this.normalizeSize(cloudFile.size);

    return this.documents.some(localDoc => {
      const normalizedLocalName = this.normalizeFileName(localDoc.name);
      const localSize = this.normalizeSize(localDoc.size);
      
      return normalizedLocalName === normalizedCloudName && 
             Math.abs(localSize - cloudSize) < 1024; // Allow small size differences
    });
  }

  private normalizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[<>:"|?*\\\/\s]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '')
      .trim();
  }

  private normalizeSize(size: any): number {
    if (typeof size === 'string') {
      return parseInt(size) || 0;
    }
    return size || 0;
  }

  private async checkAuthenticationStatus(): Promise<void> {
    try {
      this.driveAuthenticated = this.driveService.isAuthenticated;
      console.log('Authentication status:', {
        googleDrive: this.driveAuthenticated
      });
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  }

  setView(view: 'list' | 'grid') {
    this.currentView = view;
  }

  onFileUpload(event: any) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('user_id', '1');
    formData.append('document', file);
    formData.append('type', file.type);
    formData.append('size', file.size.toString()); 
    formData.append('folder_id', '1');
    
    this.downloadDocument(formData);
    this.selectedFile = null; 
  }

  async downloadDocument(formData: FormData): Promise<void> {
    try {
      await this.documentsService.addDocument(formData);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Document uploaded successfully'
      });

      await this.loadLocalDocuments();

    } catch (error: any) {
      console.error('Error saving document:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: 'Failed to upload document'
      });
    }
  }

  async getDriveDocuments(): Promise<void> {
    try {
      if (!this.driveService.isAuthenticated) {
        console.warn('Not authenticated with Google Drive');
        return;
      }

      console.log('Loading Google Drive files...');
      const result = await this.driveService.listAllFiles({
        progressCallback: (current: number) => {
          console.log(`Progress: ${current} files loaded`);
        }
      });

      this.googleDriveDocuments = result.files.map((doc: any) => ({
        ...doc,
        type: this.getDriveFileType(doc),
        size: this.normalizeSize(doc.size),
        source: 'drive'
      }));
      
      console.log(`Successfully loaded ${this.googleDriveDocuments.length} Google Drive files`);
      
    } catch (error) {
      console.error('Failed to load Google Drive files:', error);
      this.googleDriveDocuments = [];
    }
  }

  private getDriveFileType(document: any): string {
    if (document.mimeType) {
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
      
      const parts = document.mimeType.split('/');
      if (parts.length > 1) {
        const subtype = parts[1];
        if (subtype.includes('word')) return 'Word Document';
        if (subtype.includes('excel') || subtype.includes('spreadsheet')) return 'Excel';
        if (subtype.includes('powerpoint') || subtype.includes('presentation')) return 'PowerPoint';
        if (subtype.includes('zip')) return 'ZIP Archive';
        
        return subtype.replace(/^(vnd\.|x-|ms-)/, '').replace(/^\w/, (c: string) => c.toUpperCase());
      }
      
      return document.mimeType;
    }
    
    return 'Unknown';
  }

  private getDropboxFileType(document: any): string {
    if (document.path_lower) {
      const extension = document.path_lower.split('.').pop()?.toLowerCase();
      return extension ? extension.toUpperCase() : 'Unknown';
    }
    return 'Unknown';
  }

  onDocumentClick(documentId: number) {
    this.router.navigate(['/documents', documentId]);
  }

  async getDropboxDocuments(): Promise<void> {
    try {
      console.log('Fetching Dropbox documents...');
      this.dropboxDocuments = await this.dropboxService.listFiles();
      console.log('Dropbox documents loaded:', this.dropboxDocuments.length);
    } catch (error) {
      console.error('Error fetching Dropbox documents:', error);
      this.dropboxDocuments = [];
    }
  }

  async getUser(userId: number): Promise<any> {
    try {
      console.log('Fetching user data...');
      const user = await this.documentsService.getUser(userId);
      
      this.documents = user.documents || [];
      this.dropboxSync = user.dropbox_sync || false;
      this.driveSync = user.drive_sync || false;
      
      console.log('Local documents loaded:', this.documents.length);
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      this.documents = [];
      throw error;
    }
  }

  async downloadToLocalFromDrive(documentId: string) {
    try {
      const file = await this.driveService.getDocumentFile(documentId);
      console.log(file);
      
      const base64Data = file.base64Content.replace(/^data:[^;]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.metadata.mimeType });
      
      const formData = new FormData();
      formData.append('name', file.metadata.name);
      formData.append('user_id', '1');
      formData.append('document', blob, file.metadata.name);
      formData.append('type', file.metadata.mimeType);
      formData.append('size', file.metadata.size.toString());
      formData.append('folder_id', '1');
      
      await this.documentsService.addDocument(formData);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Document "${file.metadata.name}" synced successfully`
      });

      await this.loadLocalDocuments();
      
    } catch (error: any) {
      console.error('Error downloading document:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to sync document: ${error.message || 'Unknown error'}`
      });
    }
  }

  async syncToGoogleDrive(document: any): Promise<void> {
    try {
      if (!this.driveSync) {
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
        const base64Data = document.document.split('base64,')[1];
        fileBlob = this.base64ToBlob(base64Data, document.type);
      } else if (document.document.startsWith('data:')) {
        const response = await fetch(document.document);
        fileBlob = await response.blob();
      } else {
        fileBlob = this.base64ToBlob(document.document, document.type);
      }

      if (!fileBlob || fileBlob.size === 0) {
        throw new Error('Failed to create valid file from document content');
      }

      const file = new File([fileBlob], cleanFileName, { 
        type: document.type || 'application/octet-stream' 
      });

      await this.driveService.uploadFile(file, cleanFileName);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Document "${cleanFileName}" synced to Google Drive successfully`
      });

      await this.loadLocalDocuments();

    } catch (error: any) {
      console.error('Google Drive sync failed:', error.message || error);
      
      this.messageService.add({
        severity: 'error',
        summary: 'Sync Failed',
        detail: error.message || 'Failed to sync document to Google Drive'
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

  private sanitizeFileName(fileName: string): string {
    let cleaned = fileName
      .replace(/[<>:"|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .trim();

    if (!cleaned.includes('.')) {
      cleaned += '.pdf';
    }

    if (cleaned.length > 255) {
      const ext = cleaned.substring(cleaned.lastIndexOf('.'));
      cleaned = cleaned.substring(0, 255 - ext.length) + ext;
    }

    return cleaned;
  }

  async downloadToLocal(document: Document): Promise<void> {
    try {
      if (!document.path_lower) {
        throw new Error('Document path is missing');
      }

      let fileBlob: Blob;
      try {
        fileBlob = await this.dropboxService.downloadFile(document.path_lower);
      } catch (sdkError) {
        fileBlob = await this.dropboxService.downloadFileDirectAPI(document.path_lower);
      }
      
      if (!fileBlob || fileBlob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const formData = new FormData();
      formData.append('name', document.name);
      formData.append('user_id', '1');
      
      const mimeType = this.getFileType(document.name);
      const file = new File([fileBlob], document.name, { type: mimeType });
      
      formData.append('document', file);
      formData.append('type', mimeType);
      formData.append('size', fileBlob.size.toString());
      formData.append('description', `Downloaded from Dropbox: ${document.name}`);

      await this.downloadDocument(formData);

    } catch (error: any) {
      let errorMessage = 'Failed to download document from Dropbox';
      
      if (error.message === 'Not authenticated') {
        errorMessage = 'Please reconnect to Dropbox';
      } else if (error.message.includes('not found')) {
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
      throw error; // Re-throw for batch sync error handling
    }
  }

  private getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const mimeTypes: { [key: string]: string } = {
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
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'svg': 'image/svg+xml',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'json': 'application/json',
      'xml': 'text/xml',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript'
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
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

      console.log('Syncing document to Dropbox:', document);
      const cleanFileName = this.sanitizeFileName(document.name);
      const dropboxPath = `/${cleanFileName}`;

      let fileBlob: Blob;
      
      if (document.document.includes('base64,')) {
        const base64Data = document.document.split('base64,')[1];
        fileBlob = this.base64ToBlob(base64Data, document.type);
      } else if (document.document.startsWith('data:')) {
        const response = await fetch(document.document);
        fileBlob = await response.blob();
      } else {
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

      await this.loadLocalDocuments();

    } catch (error: any) {
      console.error('Dropbox sync failed:', error.message || error);
      
      this.messageService.add({
        severity: 'error',
        summary: 'Sync Failed',
        detail: error.message || 'Failed to sync document to Dropbox'
      });
    }
  }

  toggleDriveSync() {
    this.driveSync = !this.driveSync;
  }

  toggleDropboxSync() {
    this.dropboxSync = !this.dropboxSync;
  }
  openDocument(doc: any) {
  console.log(doc)
  }
  
}