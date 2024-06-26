import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class FileService{
    private filesUrl = "https://localhost:4001/api/files";
    private apiUrl = "https://localhost:4001";

    constructor(private http: HttpClient) {}

    getFileLinks(id: string){
        return this.http.get<string[] | null>(`${this.filesUrl}/${id}`);
    }

    deleteAttahcment(id: string, fileName: string)
    {
        return this.http.delete<void>(`${this.filesUrl}/${id}/${fileName}`);
    }
 
    uploadPicture(id: string, picture: File): Observable<string>  {
        const formData = new FormData();
        formData.append('picture', picture);

        return this.http.post<{ url: string }>(`${this.filesUrl}/${id}`, formData).pipe(
          map((response: { url: string }) => `${this.apiUrl}/${response.url}`)
        );
    }
}