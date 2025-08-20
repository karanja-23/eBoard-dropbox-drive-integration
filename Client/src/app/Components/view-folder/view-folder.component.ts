import { Component, OnInit } from "@angular/core";
import { DocumentsService } from "../../Services/documents.service";
import { Documents } from "../../Interfaces/documents";
import { DropboxService } from "../../Services/dropbox-service.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { PopoverModule } from "primeng/popover";
import { DialogModule } from "primeng/dialog";
import { MessageService } from "primeng/api";
import { FileUploadModule } from "primeng/fileupload";
import { Router } from "@angular/router";
import { GoogleDriveService } from "../../Services/google-drive.service";
@Component({
  selector: "app-view-folder",
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    TableModule,
    PopoverModule,
    DialogModule,
    FileUploadModule,
  ],
  templateUrl: "./view-folder.component.html",
  styleUrl: "./view-folder.component.css",
  providers: [MessageService],
  standalone: true,
})
export class ViewFolderComponent implements OnInit {
  folderId: any;
  source: string = "";
  path: string = "";

  localDocuments: Documents[] = [];
  dropboxDocuments: Documents[] = [];
  taggedDocuments: Documents[] = [];
  driveDocuments: Documents[] = [];

  showAddDocumentDialog: boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private dropboxService: DropboxService,
    private messageService: MessageService,
    private router: Router,
    private driveService: GoogleDriveService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.findSource();
    await this.findDocuments();
    this.allDocumentsToShow();
  }
  async findSource() {
    const state = history.state;
    if (state && state.id) {
      this.folderId = state.id;
      this.source = state.source;
      this.path = state.path || "";
    }
  }
  async findDocuments() {
    if (this.source === "local") {
      const folder = await this.documentsService.getFolderById(this.folderId);
      this.localDocuments = folder.documents || [];
      console.log("Local Documents:", this.localDocuments);
    } else if (this.source === "dropbox") {
      this.dropboxDocuments = await this.dropboxService.getFolderContent(
        this.path
      );
      console.log("Dropbox Documents:", this.dropboxDocuments);
    } else if (this.source === "google-drive") {
      this.driveDocuments = await this.driveService.listFilesInFolder(
        this.folderId
      );
      console.log("Google Drive Documents:", this.driveDocuments);
      
    }
   else {
      console.error("Unknown source:", this.source);
      return;
    }
  }
  allDocumentsToShow() {
    this.taggedDocuments = [...this.localDocuments, ...this.dropboxDocuments ,...this.driveDocuments  ];
    this.setTags(this.taggedDocuments);
  }
  async setTags(docs: any[]) {
    docs.forEach((doc: any) => {
      if ("client_modified" in doc) {
        doc.tags = ["dropbox"];
      } else if ("date_created" in doc) {
        doc.tags = ["local"];
      } 
      else if('createdTime' in doc) {
        doc.tags = ["google-drive"];
      }
      else {
        doc.tags = [];
      }
    });
  }
  navigateToFolders() {
    this.router.navigate(["/folders"]);
  }
  async openDropboxDocument(document: Documents) {
    await this.dropboxService.openDocument(document.id.toString());
  }
  getDocumentType(document: any): string {
  try {
    // First try path_lower (for Dropbox files)
    if (document.path_lower && document.path_lower.includes('.')) {
      const extension = document.path_lower.split('.').pop();
      return extension || 'unknown';
    }
    
    // Then try document.type (for local files)
    if (document.type && document.type.includes('/')) {
      return document.type.split('/')[1] || 'unknown';
    }
    
    // Finally try mimeType (for Google Drive files)
    if (document.mimeType && document.mimeType.includes('/')) {
      return document.mimeType.split('/')[1] || 'unknown';
    }
    
    return 'unknown';
  } catch (error) {
    console.warn('Error getting document type:', error);
    return 'unknown';
  }
}
  
}
