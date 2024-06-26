import { Component, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NewsService } from '../../Services/news-service';
import { FileService } from '../../Services/file-service';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '../../models/news';
import { EditorModule } from '@tinymce/tinymce-angular';
import {Location} from '@angular/common';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
  templateUrl: './news-edit.component.html',
  styleUrl: './news-edit.component.css',
})
export class NewsEditComponent implements OnInit{
  news!: News;
  newsService : NewsService = inject(NewsService);
  fileService : FileService = inject(FileService);
  newsId: string = '';
  attachments: File[] = [];
  selectedPicture: File | null = null;
  profilsOptions: string[] = ['Eleve', 'Professeur', 'Direction'];
  fileLinks: { name: string, url: string }[] | undefined = [];
  showUpload = false;

  private filesUrl = "https://localhost:4001/api/files";

  newsForm: FormGroup =  new FormGroup({
    title: new FormControl('', [Validators.required]),
    profils: new FormControl([], [Validators.required]),
    description: new FormControl(''),
    picture: new FormControl(''),
    expirationDate: new FormControl(Date, [Validators.required, this.dateValidator]),
  });


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location : Location) {}

  ngOnInit(): void {
    this.newsId = this.route.snapshot.paramMap.get('id')!;
    this.newsService.getNewsById(this.newsId).subscribe(n => {
      this.news = n;
      this.populateForm(n);
      this.loadFileLinks();
    });
  
  }
  private loadFileLinks(): void {
   this.fileLinks = this.news?.pjs?.map(fileName => ({
      name: fileName, 
      url: `${this.filesUrl}/?id=${this.newsId}&fileName=${fileName}`
    }))   
  }

  protected populateForm(news: News): void {
    this.newsForm.setValue({
      title: news.title,
      profils: news.profils,
      description: news.description || '',
      picture : news.picture ? `https://localhost:4001/images/${this.newsId}/${news.picture}` : "https://localhost:4001/images/default.jpg",
      expirationDate: new Date(news.expirationDate).toISOString().substring(0, 10)
    });
  }

  // Handle file selection
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.attachments.push(files.item(i) as File);
    }
  }
  // Remove a file from the selected files list
  removeFile(file: File): void {
    this.attachments = this.attachments.filter(f => f !== file);
  }

  removeExistingFile(filename: string): void{
    this.fileService.deleteAttahcment(this.newsId, filename)
    .subscribe( () => this.fileLinks = this.fileLinks?.filter(fl => fl.name !== filename));
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      const updatedNews: News = this.newsForm.value;
      const formData = new FormData();

      if(updatedNews.title){
          formData.append('Title', updatedNews.title);
      }

      if(updatedNews.description){
        formData.append('Description', updatedNews.description);
      }

      if(updatedNews.expirationDate){
        formData.append('ExpirationDate', updatedNews.expirationDate.toString());
      }

      updatedNews.profils.forEach(p => formData.append('Profils', p))
      this.attachments.forEach((file) => formData.append(`Attachments`, file));

      this.newsService.updateNews(this.newsId, formData).subscribe({
        next: (response: HttpResponse<News>) => {
          if (response.status === 200) {
            this.router.navigate(['/']);
          } else {
            console.error('Update failed', response);
          }
        }
      });
    }
  }

  triggerImgInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  onPictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPicture = file;
      this.uploadPicture();
    }
  }

  uploadPicture(): void {
    if (this.selectedPicture) {
      this.fileService.uploadPicture(this.newsId, this.selectedPicture)
      .subscribe(url => this.newsForm.get('picture')?.setValue(url));
    }
  }

  goBack(): void{
    this.location.back();
  }

  dateValidator(control: AbstractControl) {
    if (!control.value) {
      return { required: true };
    }
    // Check if the expiratiopn date is at least today
    const inputDate = new Date(control.value);
    const today = new Date();
  
    if (inputDate < today) {
      return { dateInPast: true };
    }
    return null;
  }
}
