import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import {
  SortableHeader,
  SortEvent,
} from 'src/app/shared/directive/sortable.directive';
import { InvitationService } from 'src/app/services/invitation.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-users-approve',
  templateUrl: './users-approve.component.html',
  styleUrls: ['./users-approve.component.scss'],
})
export class UsersApproveComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader>;

  constructor(
    private route: ActivatedRoute,
    private service: InvitationService,
    public sortService: SortService
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest(
      this.route.paramMap,
      this.service.userApproveInvitations
    ).subscribe(([params, invitations]) => {
      const id = params.get('id');
      this.sortService.setItems(
        invitations.filter((i) => i.invitationId === id)
      );
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortService.sortColumn = column;
    this.sortService.sortDirection = direction;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
