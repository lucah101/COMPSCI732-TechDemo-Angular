import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { billsData } from '../bills/bills.data';
import { Bill } from '../bills/bills.model';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit {
  // canvas element for the pie chart
  @ViewChild('pieCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // all bills from bills.data.ts
  bills: Bill[] = billsData;

  // list of labels for the pie chart
  totalsList: { label: string; total: number }[] = [];
  // selected label for the pie chart
  activeIndex: number | null = null;

  private ctx!: CanvasRenderingContext2D;
  private sliceRanges: { start: number; end: number }[] = [];
  private labels: string[] = [];
  private values: number[] = [];
  private colors = ['#FF6384', '#36A2EB', '#FACE56', '#4BC0C0', '#9952FF', '#FF9F40', '#A8ABCF'];

  // constructor to initialize the component
  ngOnInit(): void {
    this.drawPieChart();
  }

  // draw the pie chart
  drawPieChart(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.sliceRanges = [];

    // Aggregate total price per label
    const map = new Map<string, number>();
    for (const b of this.bills) {
      map.set(b.label, (map.get(b.label) || 0) + b.price);
    }
    // Extract sorted labels and totals
    this.labels = Array.from(map.keys());
    this.values = Array.from(map.values());
    const total = this.values.reduce((a, b) => a + b, 0);

    // Format totals list with rounded values and sort descending
    this.totalsList = this.labels.map((label, i) => ({
      label,
      total: parseFloat(this.values[i].toFixed(2))
    })).sort((a, b) => b.total - a.total);
    
    // Sync the sorted labels and values
    this.labels = this.totalsList.map(item => item.label);
    this.values = this.totalsList.map(item => item.total);
    
    // Set up chart center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    let startAngle = 0;

    // Clear canvas before drawing
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each slice of the pie chart
    this.labels.forEach((label, i) => {
      const value = this.values[i];
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      this.sliceRanges[i] = { start: startAngle, end: endAngle };

      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.closePath();

      // Apply active or faded color
      const baseColor = this.colors[i % this.colors.length];
      this.ctx.fillStyle = this.activeIndex === null
        ? baseColor
        : this.activeIndex === i
          ? baseColor
          : baseColor + '30'; 

      this.ctx.fill();

      // Compute label position
      const midAngle = startAngle + sliceAngle / 2;
      const textX = centerX + (radius / 1.6) * Math.cos(midAngle);
      const textY = centerY + (radius / 1.6) * Math.sin(midAngle);
      const percent = ((value / total) * 100).toFixed(1) + '%';

      // Draw label and percentage
      this.ctx.fillStyle = 'white';
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, textX, textY - 6);
      this.ctx.fillText(percent, textX, textY + 9);

      startAngle = endAngle;
    });
  }

  // Called when user clicks a label (to highlight chart slice)
  onLabelClick(index: number): void {
    this.activeIndex = index === this.activeIndex ? null : index;
    this.drawPieChart();
  }
}
