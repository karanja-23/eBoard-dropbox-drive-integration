import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from '../../Services/documents.service';
import { Documents } from '../../Interfaces/documents';
@Component({
  selector: 'app-view-folder',
  imports: [],
  templateUrl: './view-folder.component.html',
  styleUrl: './view-folder.component.css'
})
export class ViewFolderComponent implements OnInit{

  folderId:any;
  source: string = '';

  localDocuments: Documents[] = [];

  constructor(
    private router: Router,
    private documentsService: DocumentsService
  ){}

  async ngOnInit(): Promise<void> {
    await this.findSource();
    await this.findDocuments();
  }
  async findSource() {
    const state = history.state;
    if (state && state.id) {
      this.folderId = state.id;
      this.source = state.source;
    }
  }
  async findDocuments() {
    if (this.source === 'local') {
      const folder = await this.documentsService.getFolderById(this.folderId);
      this.localDocuments = folder.documents || [];
      console.log('Local Documents:', this.localDocuments);

    }
    else if(this.source === 'dropbox') {

    }
    else{
      console.error('Unknown source:', this.source);
      return;
    }
    
  }
  
}
