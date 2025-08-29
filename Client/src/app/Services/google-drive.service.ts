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

  /**
   * Initialize Google Services (GIS + GAPI)
   */
  private async initializeGoogleServices(): Promise<void> {
  if (!this.isBrowser) {
    console.warn('Google services initialization skipped - not in browser environment');
    return;
  }

  try {
    console.log('🔧 Initializing Google Services...');
    console.log('🌐 Current origin:', window.location.origin);
    console.log('🔑 Client ID:', this.CLIENT_ID);
    
    // Load both Google Identity Services and GAPI
    await Promise.all([
      this.loadGISScript(),
      this.loadGapiScript()
    ]);

    // Initialize both services
    await this.initializeGIS();
    await this.initializeGAPI();
    
    // Check for existing authentication
    await this.checkInitialAuthStatus();
    
    console.log('✅ Google services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google services:', error);
  }
}


  /**
   * Load Google Identity Services script
   */
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

  /**
   * Load Google API script
   */
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

  /**
   * Initialize Google Identity Services
   */
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
            console.log('✅ Authentication successful');
            this.authStatusSubject.next(true);
          }
        },
      });

      this.gisInitialized = true;
      console.log('✅ Google Identity Services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize GIS:', error);
      throw error;
    }
  }

  /**
   * Initialize Google API Client
   */
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
          console.log('✅ GAPI client initialized');
          resolve();
        } catch (error) {
          console.error('❌ Failed to initialize GAPI client:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Check if services are available
   */
  private checkAvailability(): boolean {
    if (!this.isBrowser) {
      console.warn('Google Drive service not available in server environment');
      return false;
    }
    if (!this.gisInitialized || !this.gapiInitialized) {
      console.warn('Google services not initialized yet');
      return false;
    }
    return true;
  }

  /**
   * Authenticate with Google Drive using new GIS
   */
 

async authenticate(): Promise<boolean> {
  if (!this.checkAvailability()) {
    return false;
  }

  console.log('🔐 Starting authentication...');

  // First, try to use stored token
  const storedToken = this.getStoredToken();
  if (storedToken) {
    console.log('📱 Found stored token, validating...');
    const isValid = await this.validateStoredToken(storedToken);
    if (isValid) {
      console.log('✅ Stored token is valid, using it');
      this.setToken(storedToken);
      this.authStatusSubject.next(true);
      return true;
    } else {
      console.log('❌ Stored token is invalid, removing it');
      this.clearStoredToken();
    }
  }

  // If no stored token or invalid, request new one
  console.log('🔄 Requesting new token...');
  return this.requestNewToken();
}
private async requestNewToken(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    this.tokenClient.callback = (response: any) => {
      if (response.error !== undefined) {
        console.error('❌ Token error:', response.error);
        this.authStatusSubject.next(false);
        reject(false);
      } else {
        console.log('✅ New token received');
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

/**
 * Get stored token from localStorage
 */
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

/**
 * Store token in localStorage
 */
private storeToken(token: string): void {
  if (!this.isBrowser) {
    return;
  }
  
  try {
    localStorage.setItem('googleDriveAccessToken', token);
    this.driveIsAuthenticated = true;
    console.log('💾 Token stored successfully');
  } catch (error) {
    console.warn('Failed to store token:', error);
  }
}

/**
 * Clear stored token
 */
private clearStoredToken(): void {
  if (!this.isBrowser) {
    return;
  }
  
  try {
    localStorage.removeItem('googleDriveAccessToken');
    this.driveIsAuthenticated = false;
    console.log('🗑️ Stored token cleared');
  } catch (error) {
    console.warn('Failed to clear stored token:', error);
  }
}

/**
 * Set token in GAPI client
 */
private setToken(token: string): void {
  if (typeof gapi !== 'undefined' && gapi.client) {
    gapi.client.setToken({
      access_token: token
    });
  }
}

/**
 * Validate stored token by making a simple API call
 */
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
      // Other error, assume token might be valid but there's a different issue
      console.warn('Token validation returned unexpected status:', response.status);
      return false;
    }
  } catch (error) {
    console.warn('Token validation failed:', error);
    return false;
  }
}

/**
 * Enhanced getAccessToken method
 */
getAccessToken(): string | null {
  if (!this.checkAvailability()) {
    return null;
  }
  
  // First try to get token from GAPI client
  const gapiToken = gapi.client.getToken();
  if (gapiToken?.access_token) {
    return gapiToken.access_token;
  }
  
  // Fallback to stored token
  return this.getStoredToken();
}

/**
 * Enhanced sign out method
 */
async signOut(): Promise<void> {
  if (!this.checkAvailability()) {
    return;
  }

  try {
    const token = this.getAccessToken();
    if (token) {
      // Revoke token
      google.accounts.oauth2.revoke(token, () => {
        console.log('✅ Token revoked successfully');
      });
      
      // Clear from GAPI client
      gapi.client.setToken(null);
    }
    
    // Clear stored token
    this.clearStoredToken();
    
    this.authStatusSubject.next(false);
    console.log('✅ Signed out successfully');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

/**
 * Check authentication status on service initialization
 */
private async checkInitialAuthStatus(): Promise<void> {
  const storedToken = this.getStoredToken();
  if (storedToken) {
    console.log('🔍 Checking stored token on initialization...');
    const isValid = await this.validateStoredToken(storedToken);
    if (isValid) {
      this.setToken(storedToken);
      this.authStatusSubject.next(true);
      console.log('✅ Restored authentication from stored token');
    } else {
      this.clearStoredToken();
    }
  }
}

  /**
   * Sign out from Google Drive
   */


  /**
   * Get current authentication status
   */
  get isAuthenticated(): boolean {
    return this.authStatusSubject.value;
  }

  /**
   * Get current access token
   */
 
  /**
   * Check if the service is ready to use
   */
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
    // If we get a 401 (unauthorized) and haven't retried yet, try to re-authenticate
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

  /**
   * List files in Google Drive
   */
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

    console.log('Starting to list all files from Google Drive...');
    
    const {
      query = '',
      includeDeleted = false,
      maxResults = 10000, // Reasonable limit to prevent infinite loops
      orderBy = 'modifiedTime desc',
      progressCallback
    } = options;

    let allFiles: any[] = [];
    let nextPageToken: string | undefined = undefined;
    let totalRequests = 0;
    const pageSize = 1000; // Maximum allowed by Google Drive API

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
      
      // Safety check to prevent infinite loops
      if (allFiles.length >= maxResults) {
        console.log(`Reached maximum results limit: ${maxResults}`);
        break;
      }
      
      // Add small delay to be nice to the API
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

  /**
   * Upload a file to Google Drive
   */
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

/**
 * Download file as ArrayBuffer (browser compatible)
 */
async downloadFileAsBuffer(fileId: string): Promise<ArrayBuffer> {
  if (!this.checkAvailability() || !this.isAuthenticated) {
    throw new Error('Service not ready or user not authenticated');
  }

  try {
    // First get metadata to check file type
    const metadata = await this.getFileMetadata(fileId);
    console.log('File metadata:', {
      name: metadata.name,
      mimeType: metadata.mimeType,
      size: metadata.size
    });

    // Check if it's a Google Workspace file
    if (this.isGoogleWorkspaceFile(metadata.mimeType)) {
      console.log('Exporting Google Workspace file...');
      return await this.exportGoogleWorkspaceFile(fileId, metadata.mimeType);
    } else {
      console.log('Downloading regular file...');
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
    base64Content: this.arrayBufferToBase64(content), // This is your base64 string
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

/**
 * Get export MIME type for Google Workspace files
 */
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

/**
 * Get file extension for export format
 */
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

/**
 * Get file metadata (update your existing method or add if missing)
 */


/**
 * Download regular files (non-Google Workspace files)
 */
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

/**
 * Export Google Workspace files
 */
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

/**
 * Updated download method - replace your existing downloadFileAsBuffer
 */


/**
 * Get file with content and proper naming
 */
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

/**
 * Convert ArrayBuffer to base64 string
 */


/**
 * Get file as base64 string (this is what you want!)
 */
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