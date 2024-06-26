import { Component, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NewsService } from '../../Services/news-service';
import { Router } from '@angular/router';
import { News } from '../../models/news';
import { EditorModule } from '@tinymce/tinymce-angular';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
  templateUrl: './news-create.component.html',
  styleUrl: './news-create.component.css',
})
export class NewsCreateComponent {

  repo : NewsService = inject(NewsService);
  attachments: File[] = [];
  selectedPicture: File | null = null;
  showUpload = false;
  profilsOptions: string[] = ['Eleve', 'Professeur', 'Direction'];

  previewUrl: string | ArrayBuffer | null = null;

  newsForm: FormGroup =  new FormGroup({
    title: new FormControl('', [Validators.required]),
    profils: new FormControl([], [Validators.required]),
    description: new FormControl(''),
    picture: new FormControl("https://localhost:4001/images/default.jpg"),
    expirationDate: new FormControl(Date, [Validators.required, this.dateValidator]),
  });

  constructor(
    private location : Location,
    private router: Router
  ) {}

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.attachments.push(files.item(i) as File);
    }
  }
  resetForm(): void{
    this.newsForm.reset()
    this.attachments = [];
    this.selectedPicture = null;
  }
  onImgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedPicture = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.newsForm.get('picture')?.setValue(e.target.result) ;
      };
      reader.readAsDataURL(this.selectedPicture);
    }
  }

  removeFile(file: File): void {
    this.attachments = this.attachments.filter(f => f !== file);
  }

  onSubmit(): void {
     if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
     }

    const createdNews: News = this.newsForm.value;
    const formData = new FormData();

    formData.append('Title', createdNews.title);
    formData.append('Description', createdNews.description ?? '');
    formData.append('ExpirationDate', createdNews.expirationDate.toString());
    createdNews.profils.forEach(p => formData.append('Profils', p))
    this.attachments.forEach((file) => formData.append(`Attachments`, file));

    if(this.selectedPicture){
      formData.append(`Picture`, this.selectedPicture )
    }

    this.repo.CreateNews(formData).subscribe(() => this.router.navigate(['/']));
  }

  goBack(): void{
    this.location.back();
  }

  dateValidator(control: AbstractControl) {
    if (!control.value) {
      return { required: true };
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;  // YYYY-MM-DD
    const isValid = dateRegex.test(control.value);
    if(!isValid){
      return {dateInvalide: true};
    }   
    
    const inputDate = new Date(control.value);
    const today = new Date();
    if (inputDate < today) {
      return { dateInPast: true };
    }
    return null;
  }
}
