import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingScreen } from "../loading-screen/loading-screen";
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-lead-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingScreen],
  templateUrl: './lead-modal.html',
  styleUrl: './lead-modal.scss',
})
export class LeadModal {

  constructor(private commonService: CommonService) {}

  loading = signal(false);
  visible = signal(false);
  success = signal(false);

  name = signal('');
  email = signal('');
  phone = signal('');
  subjects = signal<string[]>([]);

  availableSubjects = [
    'Python',
    'AWS',
    'DevOps',
    'MERN',
    'MEAN',
    'Linux',
    'Cloud Computing',
    'Data Structures'
  ];

  @Output() submitted = new EventEmitter<any>();

  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }

  toggleSubject(subject: string) {
    const selected = this.subjects();
    if (selected.includes(subject)) {
      this.subjects.set(selected.filter(s => s !== subject));
    } else {
      this.subjects.set([...selected, subject]);
    }
  }

  submit() {
    this.loading.set(true);

    const payload = {
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      subject: this.subjects().join(', ') || 'None',
      source: 'Website Lead'
    };

    this.commonService.saveLead(payload).subscribe({
      next: () => {
        console.log('Lead Saved:', payload);

        this.submitted.emit(payload);

        this.name.set('');
        this.email.set('');
        this.phone.set('');
        this.subjects.set([]);

        this.loading.set(false);
        this.success.set(true);

        setTimeout(() => this.close(), 2500);
      },
      error: (err) => {
        console.error('Lead Save Failed:', err);
        this.loading.set(false);
        alert('Something went wrong while saving lead.');
      }
    });
  }
}
