import { Routes } from '@angular/router';
import { Register } from './modules/auth/register/register';
import { Enrollments } from './modules/enrollments/enrollments';
import { AddEditEnrollment } from './modules/enrollments/add-edit-enrollment/add-edit-enrollment';
import { AddLesson } from './modules/courses/add-lesson/add-lesson';
import { CourseDetail } from './modules/courses/course-detail/course-detail';

import { AuthGuard } from './core/guards/auth-guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ========================
  // 🚫 PUBLIC ROUTES (Only when NOT logged in)
  // ========================
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./modules/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./modules/auth/register/register').then(c => c.Register)
  },

  // ========================
  // 🔒 PROTECTED ROUTES
  // ========================

  {
    path: 'lead-sheet',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/sales/lead-sheet/lead-sheet').then(m => m.LeadSheet)
  },

  {
    path: 'courses',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/courses/courses').then(m => m.CoursesComponent)
  },

  {
    path: 'courses/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/courses/add-edit-course/add-edit-course')
        .then(m => m.AddEditCourse)
  },

  {
    path: 'courses/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/courses/add-edit-course/add-edit-course')
        .then(m => m.AddEditCourse)
  },

  {
    path: 'courses/:courseId',
    canActivate: [AuthGuard],
    component: CourseDetail
  },

  {
    path: 'courses/:courseId/lesson/new',
    canActivate: [AuthGuard],
    component: AddLesson
  },

  {
    path: 'courses/:courseId/lessons/:lessonId/chapter/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/courses/add-chapter/add-chapter').then(m => m.AddChapter)
  },

  {
    path: 'courses/:courseId/lessons/:lessonId/chapter/:chapterId/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/courses/add-chapter/add-chapter').then(m => m.AddChapter)
  },

  {
    path: 'instructors',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/instructors/instructors')
        .then(m => m.Instructors)
  },

  {
    path: 'instructors/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/instructors/add-edit-instructor/add-edit-instructor')
        .then(m => m.AddEditInstructor)
  },

  {
    path: 'instructors/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/instructors/add-edit-instructor/add-edit-instructor')
        .then(m => m.AddEditInstructor)
  },

  {
    path: 'enrollments',
    canActivate: [AuthGuard],
    component: Enrollments
  },

  {
    path: 'enrollments/new',
    canActivate: [AuthGuard],
    component: AddEditEnrollment
  },

  {
    path: 'enrollments/:id/edit',
    canActivate: [AuthGuard],
    component: AddEditEnrollment
  },
];
