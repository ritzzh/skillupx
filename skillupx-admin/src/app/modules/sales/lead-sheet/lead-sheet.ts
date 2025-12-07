import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Lead, SalesService } from '../services/sales-service';

@Component({
  selector: 'app-lead-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lead-sheet.html',
  styleUrl: './lead-sheet.scss',
})
export class LeadSheet implements OnInit {

  leads: Lead[] = [];
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = [
    'lead_id',
    'email',
    'name',
    'phone',
    'subject',
    'created_at'
  ];

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.fetchLeads();
  }

  fetchLeads() {
    this.loading = true;
    this.salesService.getAllLeads().subscribe({
      next: (res: { leads: Lead[]; }) => {
        this.leads = res.leads;
        this.loading = false;
      },
      error: () => {
        this.error = "Failed to load leads.";
        this.loading = false;
      }
    });
  }
}
