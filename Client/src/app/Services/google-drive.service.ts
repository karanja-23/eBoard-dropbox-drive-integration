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

  return new Promise<boolean>((resolve, reject) => {
    // Store resolve/reject in a scoped variable or closure
    this.tokenClient.callback = (response: any) => {
      if (response.error !== undefined) {
        console.error('❌ Token error:', response.error);
        this.authStatusSubject.next(false);
        reject(false);
      } else {
        console.log('✅ Token received:', response.access_token);
        // You can optionally store the token here
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
   * Sign out from Google Drive
   */
  async signOut(): Promise<void> {
    if (!this.checkAvailability()) {
      return;
    }

    try {
      const token = gapi.client.getToken();
      if (token) {
        google.accounts.oauth2.revoke(token.access_token, () => {
          console.log('✅ Token revoked successfully');
        });
        gapi.client.setToken(null);
      }
      
      this.authStatusSubject.next(false);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  /**
   * Get current authentication status
   */
  get isAuthenticated(): boolean {
    return this.authStatusSubject.value;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (!this.checkAvailability()) {
      return null;
    }
    
    const token = gapi.client.getToken();
    return token ? token.access_token : null;
    localStorage.setItem('googleDriveAccessToken', token.access_token);
    this.driveIsAuthenticated = true;
  }

  /**
   * Check if the service is ready to use
   */
  get isReady(): boolean {
    return this.isBrowser && this.gapiInitialized && this.gisInitialized;
  }

  /**
   * Make authenticated requests to Google Drive API
   */
  async makeRequest(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<any> {
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
    } catch (error) {
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
}