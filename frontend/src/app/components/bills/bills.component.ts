import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { billsData } from './bills.data';
import { Bill } from './bills.model';

// define a component and provide metadata 
@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})

export class BillsComponent implements OnInit {
  // all bills
  bills: Bill[] = billsData;
  // filtered bills
  filteredBills: Bill[] = [];
  // labels for the bills
  labels: string[] = ['telephone', 'food', 'daily', 'accommodate', 'health', 'transport', 'others'];
  selectedLabel: string = 'All';

  // current week start date: Monday
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  totalThisWeek: number = 0;
  totalByLabel: { [label: string]: number } = {};

  editIndex: number | null = null;
  selectedBillIndex: number | null = null;

  // Form state for batch input
  batchBillForm = {
    date: new Date(),
    place: '',
    items: this.labels.map(label => ({ label, price: null as number | null, note: '' }))
  };

  ngOnInit(): void {
    this.sortBills();
    this.filterBills();
  }

  // Sort bills by date in descending order
  sortBills() {
    this.bills.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get the start of the week (Monday)
  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Get the end of the week (Sunday)
  getEndOfWeek(start: Date): Date {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  }

  // Normalize date to 00:00:00
  getStartOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Normalize date to 23:59:59
  getEndOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  // Filter bills based on date and label
  filterBills() {
    const weekStart = this.getStartOfDay(this.currentWeekStart);
    const weekEnd = this.getEndOfDay(this.getEndOfWeek(weekStart));

    this.filteredBills = this.bills.filter(b => {
      const billDate = this.getStartOfDay(new Date(b.date));
      return billDate >= weekStart && billDate <= weekEnd &&
        (this.selectedLabel === 'All' || b.label === this.selectedLabel);
    });

    this.totalThisWeek = parseFloat(
      this.filteredBills.reduce((sum, bill) => sum + bill.price, 0).toFixed(2)
    );

    this.totalByLabel = {};
    for (const bill of this.filteredBills) {
      this.totalByLabel[bill.label] = parseFloat(
        ((this.totalByLabel[bill.label] || 0) + bill.price).toFixed(2)
      );
    }
  }

  // When changing the selected filter label
  onLabelChange(): void {
    this.filterBills();
    this.selectedBillIndex = null;
    this.editIndex = null;
  }

  // Navigate to previous week
  previousWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    this.currentWeekStart = newStart;
    this.filterBills();
  }

  // Navigate to next week
  nextWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    this.currentWeekStart = newStart;
    this.filterBills();
  }

  // Add bills, Submit all bills from the batch form
  submitBatch(): void {
    const billsToAdd = this.batchBillForm.items
      .filter(item => item.price !== null && item.price !== undefined)
      .map(item => ({
        label: item.label,
        price: item.price!,
        note: item.note || '',
        place: this.batchBillForm.place,
        date: new Date(this.batchBillForm.date)
      }));

    this.bills.push(...billsToAdd);
    this.sortBills();
    this.filterBills();

    // Reset the batch form
    this.batchBillForm = {
      date: new Date(),
      place: '',
      items: this.labels.map(label => ({ label, price: null, note: '' }))
    };
  }

  // Select a bill in the list
  selectBill(index: number): void {
    this.selectedBillIndex = index === this.selectedBillIndex ? null : index;
    this.editIndex = null;
  }

  // Enter edit mode for selected bill
  startEditSelected(): void {
    if (this.selectedBillIndex !== null) {
      this.editIndex = this.selectedBillIndex;
    }
  }

  // Save the bill being edited
  saveEdit(): void {
    this.sortBills();
    this.filterBills();
    this.editIndex = null;
    this.selectedBillIndex = null;
  }

  cancelEdit(): void {
    this.editIndex = null;
  }

  // Delete selected bill (with confirmation)
  confirmDeleteSelected(): void {
    if (this.selectedBillIndex === null) return;

    const shouldDelete = confirm('Delete this bill?');
    if (!shouldDelete) return;

    const billToDelete = this.filteredBills[this.selectedBillIndex];
    const globalIndex = this.bills.findIndex(b =>
      b.date.getTime() === new Date(billToDelete.date).getTime() &&
      b.place === billToDelete.place &&
      b.label === billToDelete.label &&
      b.price === billToDelete.price &&
      b.note === billToDelete.note
    );

    if (globalIndex !== -1) {
      this.bills.splice(globalIndex, 1);
      this.filterBills();
      this.selectedBillIndex = null;
      this.editIndex = null;
    }
  }

  // Handle date change for editable bill
  onEditDateChange(value: string, bill: Bill): void {
    bill.date = new Date(value);
  }

  // Check if all item prices in batch form are empty or zero
  isAllPricesEmpty(): boolean {
    return this.batchBillForm.items.every(item => !item.price || item.price <= 0);
  }
  
}
