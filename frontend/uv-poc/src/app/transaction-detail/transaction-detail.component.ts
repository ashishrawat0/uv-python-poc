import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CreditCardService } from '../service/credit-card.service';
import { DiscountService } from '../service/discount.service';
import { RefundService } from '../service/refund.service';
import { CommissionService } from '../service/commission.service';
import { CustomerHistoryComponent } from '../customer-history/customer-history.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
})
export class TransactionDetailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private creditCardService: CreditCardService,
    private discountService: DiscountService,
    private refundService: RefundService,
    private commissionService: CommissionService,
    public dialog: MatDialog
  ) {}
  headerData;
  cardDetails: any;
  creditCardHeading = [];
  discountPct: any;
  discountSubtotal: any;
  transactionId: any;
  refundManagerName: any;
  refundTicketNumber: any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.headerData = JSON.parse(params['transactionData']);
    });

    this.commissionService.activeTab.subscribe((data) => {
      if (data.toString() == 'Credit card') {
        this.creditCardService
          .get(this.headerData.customerDetails['transactionId'])
          .subscribe((res: any) => {
            this.cardDetails = res['cardDetails'];
            this.creditCardHeading = Object.keys(res['cardDetails'][0]);
          });
      }
    });
  }

  showRefundDetails() {
    this.refundService
      .refundDetails(this.headerData.customerDetails['transactionId'])
      .subscribe((res: any) => {
        this.refundManagerName = res.refundData['refundMgrName'];
        this.refundTicketNumber = res.refundData['ticketNumber'];
      });
  }

  showDiscountDetails() {
    this.discountService
      .get(this.headerData.customerDetails['transactionId'])
      .subscribe((res: any) => {
        this.discountPct = res.discountDetails['pct'];
        this.discountSubtotal = res.discountDetails['subTotal'];
      });
  }

  onChangeTab(event) {
    this.commissionService.changeActiveTab(event['tab']['textLabel']);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CustomerHistoryComponent, {
      width: '800px',
    });
  }
}
