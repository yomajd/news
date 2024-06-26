import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewsEditComponent } from './components/news-edit/news-edit.component'; 
import { NewsCreateComponent } from './components/news-create/news-create.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsLoginComponent } from './components/news-login/news-login.component';
import { authGuard } from './guards/auth.guard';
import { EditNewsGuard } from './guards/edit-news.guard';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';

export const routeConfig: Routes = [
    {
        path: 'login',
        component: NewsLoginComponent,
        title: 'Login'
    },
    {
        path: 'list',
        component: NewsListComponent,
        title: 'News List',
        canActivate: [authGuard]
    },
    {
        path: 'create',
        component: NewsCreateComponent,
        title: 'Create news',
        canActivate: [authGuard], data: { roles: ['direction'] }
    },
    {
        path: 'edit/:id',
        component: NewsEditComponent,
        title: 'Edit news',
        canActivate: [EditNewsGuard]
    },
    {
        path: 'detail/:id',
        component: NewsDetailComponent,
        title: 'News detail',
        canActivate: [authGuard]
    },
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
        canActivate: [authGuard]
    }
];

export default routeConfig;
