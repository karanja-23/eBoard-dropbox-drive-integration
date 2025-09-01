import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

// Declare gapi as any to avoid import issues during SSR
declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private readonly CLIENT_ID = '159275077726-04l1m9742c2mgbu95on0e2ekaenb8fe0.apps.googleusercontent.com';
  private readonly API_KEY = 'AIzaSyDtRjD9d--12xVRgEYmNZN3JIsLmD0nLqE';
  private readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive';

private authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$ = this.authStatusSubject.asObservable();

  private gapiInitialized = false;
  private gisInitialized = false;
  private isBrowser: boolean;
  private tokenClient: any;

  public driveIsAuthenticated: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      this.initializeGoogleServices();
    }
  }

 
  private async initializeGoogleServices(): Promise<void> {
  if (!this.isBrowser) {
    
    return;
  }

  try {
    
    await Promise.all([
      this.loadGISScript(),
      this.loadGapiScript()
    ]);

    
    await this.initializeGIS();
    await this.initializeGAPI();
    
    await this.checkInitialAuthStatus();
  } catch (error) {
    console.error('❌ Failed to initialize Google services:', error);
  }
}

  private loadGISScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        setTimeout(() => resolve(), 100);
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }


  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof gapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        setTimeout(() => resolve(), 100);
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }


  private async initializeGIS(): Promise<void> {
    if (typeof google === 'undefined') {
      throw new Error('Google Identity Services not loaded');
    }

    try {
      // Initialize the token client for OAuth
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES,
        callback: (response: any) => {
          if (response.error) {
            console.error('Token response error:', response.error);
            this.authStatusSubject.next(false);
          } else {
            console.log('Authentication successful');
            this.authStatusSubject.next(true);
          }
        },
      });

      this.gisInitialized = true;
      console.log('Google Identity Services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize GIS:', error);
      throw error;
    }
  }


  private async initializeGAPI(): Promise<void> {
    if (typeof gapi === 'undefined') {
      throw new Error('GAPI not loaded');
    }

    return new Promise((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: this.API_KEY,
            discoveryDocs: this.DISCOVERY_DOCS,
          });
          
          this.gapiInitialized = true;
          console.log('GAPI client initialized');
          resolve();
        } catch (error) {
          console.error('Failed to initialize GAPI client:', error);
          reject(error);
        }
      });
    });
  }

  private checkAvailability(): boolean {
    if (!this.isBrowser) {
      
      return false;
    }
    if (!this.gisInitialized || !this.gapiInitialized) {

      return false;
    }
    return true;
  }


async authenticate(): Promise<boolean> {
  if (!this.checkAvailability()) {
    return false;
  }

  const storedToken = this.getStoredToken();
  if (storedToken) {
    
    const isValid = await this.validateStoredToken(storedToken);
    if (isValid) {
      
      this.setToken(storedToken);
      this.authStatusSubject.next(true);
      return true;
    } else {
      console.log('Stored token is invalid, removing it');
      this.clearStoredToken();
    }
  }

  // If no stored token or invalid, request new one
  
  return this.requestNewToken();
}
private async requestNewToken(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    this.tokenClient.callback = (response: any) => {
      if (response.error !== undefined) {
        console.error('Token error:', response.error);
        this.authStatusSubject.next(false);
        reject(false);
      } else {
        
        this.setToken(response.access_token);
        this.storeToken(response.access_token);
        this.authStatusSubject.next(true);
        resolve(true);
      }
    };

    try {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (error) {
      console.error('Authentication exception:', error);
      this.authStatusSubject.next(false);
      reject(false);
    }
  });
}

private getStoredToken(): string | null {
  if (!this.isBrowser) {
    return null;
  }
  
  try {
    return localStorage.getItem('googleDriveAccessToken');
  } catch (error) {
    console.warn('Failed to read stored token:', error);
    return null;
  }
}

private storeToken(token: string): void {
  if (!this.isBrowser) {
    return;
  }
  
  try {
    localStorage.setItem('googleDriveAccessToken', token);
    this.driveIsAuthenticated = true;
    
  } catch (error) {
    console.warn('Failed to store token:', error);
  }
}


private clearStoredToken(): void {
  if (!this.isBrowser) {
    return;
  }
  
  try {
    localStorage.removeItem('googleDriveAccessToken');
    this.driveIsAuthenticated = false;
    
  } catch (error) {
    console.warn('Failed to clear stored token:', error);
  }
}


private setToken(token: string): void {
  if (typeof gapi !== 'undefined' && gapi.client) {
    gapi.client.setToken({
      access_token: token
    });
  }
}

private async validateStoredToken(token: string): Promise<boolean> {
  try {
    // Set the token temporarily for validation
    this.setToken(token);
    
    // Make a simple API call to validate the token
    const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      // Token is expired or invalid
      return false;
    } else {
      // Other error
      console.warn('Token validation returned unexpected status:', response.status);
      return false;
    }
  } catch (error) {
    console.warn('Token validation failed:', error);
    return false;
  }
}

getAccessToken(): string | null {
  if (!this.checkAvailability()) {
    return null;
  }
  
  // Try to get token from GAPI client
  const gapiToken = gapi.client.getToken();
  if (gapiToken?.access_token) {
    return gapiToken.access_token;
  }
  
  // Fallback to stored token
  return this.getStoredToken();
}


async signOut(): Promise<void> {
  if (!this.checkAvailability()) {
    return;
  }

  try {
    const token = this.getAccessToken();
    if (token) {
      // Revoke token
      google.accounts.oauth2.revoke(token, () => {
       
      });
      
      // Clear from GAPI client
      gapi.client.setToken(null);
    }
    
    // Clear stored token
    this.clearStoredToken();
    
    this.authStatusSubject.next(false);
    
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

private async checkInitialAuthStatus(): Promise<void> {
  const storedToken = this.getStoredToken();
  if (storedToken) {
    
    const isValid = await this.validateStoredToken(storedToken);
    if (isValid) {
      this.setToken(storedToken);
      this.authStatusSubject.next(true);
      
    } else {
      this.clearStoredToken();
    }
  }
}

  get isAuthenticated(): boolean {
    return this.authStatusSubject.value;
  }

  
  get isReady(): boolean {
    return this.isBrowser && this.gapiInitialized && this.gisInitialized;
  }

  async makeRequest(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any, retryCount = 0): Promise<any> {
  if (!this.checkAvailability()) {
    throw new Error('Google Drive service not available');
  }

  if (!this.isAuthenticated) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await gapi.client.request({
      path: path,
      method: method,
      body: body
    });
    
    return response.result;
  } catch (error: any) {
    // If unauthorized, try to re-authenticate
    if (error.status === 401 && retryCount === 0) {
      console.log('🔄 Token expired, attempting to re-authenticate...');
      this.clearStoredToken();
      this.authStatusSubject.next(false);
      
      const reAuthSuccess = await this.authenticate();
      if (reAuthSuccess) {
        // Retry the request once
        return this.makeRequest(path, method, body, retryCount + 1);
      }
    }
    
    console.error('API request failed:', error);
    throw error;
  }
}


  async listAllFiles(options: {
  query?: string;
  includeDeleted?: boolean;
  maxResults?: number;
  orderBy?: string;
  progressCallback?: (current: number, total?: number) => void;
} = {}): Promise<any> {
  try {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated with Google Drive');
    }

    
    const {
      query = '',
      includeDeleted = false,
      maxResults = 10000, 
      orderBy = 'modifiedTime desc',
      progressCallback
    } = options;

    let allFiles: any[] = [];
    let nextPageToken: string | undefined = undefined;
    let totalRequests = 0;
    const pageSize = 1000; 

    do {
      totalRequests++;
      console.log(`Making request ${totalRequests}, current files: ${allFiles.length}`);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Base query - exclude deleted files by default
      let baseQuery = includeDeleted ? '' : 'trashed=false';
      
      if (query) {
        baseQuery = baseQuery ? `(${baseQuery}) and (${query})` : query;
      }
      
      if (baseQuery) {
        params.append('q', baseQuery);
      }
      
      // Pagination
      params.append('pageSize', pageSize.toString());
      if (nextPageToken) {
        params.append('pageToken', nextPageToken);
      }
      
      // Fields to retrieve
      const fields = 'nextPageToken,files(id,name,mimeType,size,modifiedTime,createdTime,parents,webViewLink,webContentLink,thumbnailLink,owners,shared,starred,version)';
      params.append('fields', fields);
      
      // Order by
      if (orderBy) {
        params.append('orderBy', orderBy);
      }
      
      const path = `/drive/v3/files?${params.toString()}`;
      console.log(`Request ${totalRequests} path:`, path);
      
      const response = await this.makeRequest(path);
      console.log(`Response ${totalRequests}:`, {
        filesCount: response.files?.length || 0,
        hasNextPage: !!response.nextPageToken
      });
      
      if (response.files && Array.isArray(response.files)) {
        allFiles = allFiles.concat(response.files);
        
        // Call progress callback if provided
        if (progressCallback) {
          progressCallback(allFiles.length);
        }
        
        console.log(`Total files collected so far: ${allFiles.length}`);
      }
      
      nextPageToken = response.nextPageToken;
      
      // prevent infinite loops
      if (allFiles.length >= maxResults) {        
        break;
      }
      
      // delay
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } while (nextPageToken && totalRequests < 100); // Max 100 requests as safety

    console.log(`Completed listing files. Total files: ${allFiles.length}, Total requests: ${totalRequests}`);
    
    return {
      files: allFiles,
      totalFiles: allFiles.length,
      totalRequests: totalRequests,
      query: query || 'all files'
    };
    
  } catch (error) {
    console.error('Failed to list all files:', error);
    throw error;
  }
}

  
  async uploadFile(file: File, name?: string): Promise<any> {
    if (!this.checkAvailability() || !this.isAuthenticated) {
      throw new Error('Service not ready or user not authenticated');
    }

    const metadata = {
      name: name || file.name,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    const token = this.getAccessToken();
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });

    return response.json();
  }
  async listFolders(): Promise<any> {
    if (!this.checkAvailability() || !this.isAuthenticated) {
      throw new Error('Service not ready or user not authenticated');
    }

    const params = new URLSearchParams({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id,name)',
      pageSize: '1000'
    });

    const response = await this.makeRequest(`/drive/v3/files?${params.toString()}`);
    
    return response.files || [];
  }
  async listFilesInFolder(folderId: string): Promise<any> {
    if (!this.checkAvailability() || !this.isAuthenticated) {
      throw new Error('Service not ready or user not authenticated');
    }

    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,size,modifiedTime,createdTime)',
      pageSize: '1000'
    });

    const response = await this.makeRequest(`/drive/v3/files?${params.toString()}`);
    
    return response.files || [];
  }
  async createFolder(name: string, parentId?: string): Promise<any> {
    if (!this.checkAvailability() || !this.isAuthenticated) {
      throw new Error('Service not ready or user not authenticated');
    }

    const metadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };

    const response = await this.makeRequest('/drive/v3/files', 'POST', metadata);
    
    return response;
  }
  async getFileMetadata(fileId: string): Promise<any> {
  if (!this.checkAvailability() || !this.isAuthenticated) {
    throw new Error('Service not ready or user not authenticated');
  }

  const fields = 'id,name,mimeType,size,modifiedTime,createdTime,version,parents,webViewLink,webContentLink,owners';
  const response = await this.makeRequest(`/drive/v3/files/${fileId}?fields=${fields}`);
  
  return response;
}

async downloadFileAsBuffer(fileId: string): Promise<ArrayBuffer> {
  if (!this.checkAvailability() || !this.isAuthenticated) {
    throw new Error('Service not ready or user not authenticated');
  }

  try {
    // First get metadata to check file type
    const metadata = await this.getFileMetadata(fileId);
    

    // Check if it's a Google Workspace file
    if (this.isGoogleWorkspaceFile(metadata.mimeType)) {
      
      return await this.exportGoogleWorkspaceFile(fileId, metadata.mimeType);
    } else {
     
      return await this.downloadRegularFile(fileId);
    }
    
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}
 async getDocumentFile(fileId: string): Promise<{
  metadata: any;
  base64Content: string;
  exportedName?: string;
}> {
  const { metadata, content, exportedName } = await this.getFileWithContent(fileId);
  
  return {
    metadata,
    base64Content: this.arrayBufferToBase64(content), 
    exportedName
  };
}
arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // Process in chunks to avoid call stack limits
  let binary = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  
  return btoa(binary);
}
private isGoogleWorkspaceFile(mimeType: string): boolean {
  const googleMimeTypes = [
    'application/vnd.google-apps.document',      // Google Docs
    'application/vnd.google-apps.spreadsheet',  // Google Sheets
    'application/vnd.google-apps.presentation', // Google Slides
    'application/vnd.google-apps.drawing',      // Google Drawings
    'application/vnd.google-apps.form',         // Google Forms
    'application/vnd.google-apps.script'        // Google Apps Script
  ];
  return googleMimeTypes.includes(mimeType);
}


private getExportMimeType(googleMimeType: string): string {
  const exportMap: { [key: string]: string } = {
    'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.google-apps.drawing': 'image/png',
    'application/vnd.google-apps.form': 'application/zip',
    'application/vnd.google-apps.script': 'application/vnd.google-apps.script+json'
  };
  
  return exportMap[googleMimeType] || 'application/pdf';
}


private getExportExtension(mimeType: string): string {
  const extensionMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'image/png': '.png',
    'application/zip': '.zip',
    'application/pdf': '.pdf',
    'application/vnd.google-apps.script+json': '.json'
  };
  return extensionMap[mimeType] || '.pdf';
}

private async downloadRegularFile(fileId: string): Promise<ArrayBuffer> {
  const token = this.getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  return await response.arrayBuffer();
}


private async exportGoogleWorkspaceFile(fileId: string, mimeType: string): Promise<ArrayBuffer> {
  const token = this.getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  const exportMimeType = this.getExportMimeType(mimeType);
  
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportMimeType)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to export file: ${response.status} ${response.statusText}`);
  }

  return await response.arrayBuffer();
}


async getFileWithContent(fileId: string): Promise<{ metadata: any, content: ArrayBuffer, exportedName?: string }> {
  const metadata = await this.getFileMetadata(fileId);
  const content = await this.downloadFileAsBuffer(fileId);
  
  let exportedName = metadata.name;
  
  if (this.isGoogleWorkspaceFile(metadata.mimeType)) {
    const exportMimeType = this.getExportMimeType(metadata.mimeType);
    const extension = this.getExportExtension(exportMimeType);
    exportedName = metadata.name + extension;
  }

  return {
    metadata,
    content,
    exportedName
  };
}

async getFileAsBase64(fileId: string): Promise<{
  metadata: any;
  base64Content: string;
  exportedName?: string;
}> {
  const { metadata, content, exportedName } = await this.getFileWithContent(fileId);
  
  return {
    metadata,
    base64Content: this.arrayBufferToBase64(content),
    exportedName
  };
}
}