import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressBarModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  ongoingCourses: any[] = [];
  userInfo!: UserInfo;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    // Wait for user info first
    this.commonService.getUserInfo().subscribe(user => {
      this.userInfo = user;
      console.log(user)

      if (user) {
        this.loadUserCourses();
      }
    });
  }

  loadUserCourses() {
    const userId = this.userInfo.id; // if you store it after login

    if (!userId) {
      console.error("Missing userId for enrollment lookup");
      return;
    }

    this.commonService.getUserFullCourses(userId).subscribe({
      next: (courses) => {
        console.log("Full user course structure:", courses);

        this.ongoingCourses = courses.map((courseObj: any) => {
          const course = courseObj.course;
          const lessons = courseObj.lessons || [];

          // --------------------------------------------
          // Calculate progress from chapter completion
          // --------------------------------------------
          let totalChapters = 0;
          let completedChapters = 0;

          lessons.forEach((lesson: any) => {
            if (lesson.chapters) {
              totalChapters += lesson.chapters.length;

              // TODO: Replace with real "is_completed" from backend
              completedChapters += lesson.chapters.filter((c: any) => c.completed).length;
            }
          });

          const progress = totalChapters
            ? Math.round((completedChapters / totalChapters) * 100)
            : 0;

          return {
            id: course.id,
            title: course.title,
            description: course.short_description,
            thumbnail: course.thumbnail || "assets/default-course.jpg",
            category: course.category || "General",
            progress,
            lessons
          };
        });
      },
      error: (err) => console.error(err)
    });
  }

  continueCourse(course: any) {
    console.log("Continue course:", course);
    // TODO: Navigate to course view screen
  }
}

