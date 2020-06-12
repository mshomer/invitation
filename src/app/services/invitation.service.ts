import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, take, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {
  Invitation,
  InvitationType,
  Place,
  UserApproveInvitation,
} from '../models/invitation.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private baseUrl = `https://invitations-7e937.firebaseio.com/`;
  private invitationsUrl = `${this.baseUrl}invitations`;
  private invitationTypesUrl = `${this.baseUrl}invitationsTypes`;
  private userApproveInvitationsUrl = `${this.baseUrl}userApproveInvitation`;

  private _invitations = new BehaviorSubject<Invitation[]>([]);
  private _invitationTypes = new BehaviorSubject<InvitationType[]>([]);
  private _userApproveInvitations = new BehaviorSubject<
    UserApproveInvitation[]
  >([]);

  get invitations(): Observable<Invitation[]> {
    return this._invitations.asObservable();
  }

  get invitationTypes(): Observable<InvitationType[]> {
    return this._invitationTypes.asObservable();
  }

  get userApproveInvitations(): Observable<UserApproveInvitation[]> {
    return this._userApproveInvitations.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchInvitations(): Observable<Invitation[]> {
    return this.http
      .get<{ [key: string]: Invitation }>(`${this.invitationsUrl}.json`)
      .pipe(
        map((res) => {
          const invitations = [];
          for (const key in res) {
            const invitation = res[key];
            invitation.id = key;
            invitations.push(invitation);
          }
          return invitations;
        }),
        tap((invitations) => {
          this._invitations.next(invitations);
        })
      );
  }

  getInvitation(invitationId: string): Observable<Invitation> {
    return this.invitations.pipe(
      take(1),
      map((invitations) => {
        return { ...invitations.find((p) => p.id === invitationId) };
      })
    );
  }

  deleteInvitation(invitationId: string): Observable<Invitation[]> {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http
          .delete(`${this.invitationsUrl}/${invitationId}.json?auth=${token}`)
          .pipe(
            switchMap(() => {
              return this.invitations;
            }),
            take(1),
            tap((invitations) => {
              return this._invitations.next(
                invitations.filter((p) => p.id !== invitationId)
              );
            })
          );
      })
    );
  }

  addModelInvitaion(invitation: Invitation) {
    return this.addInvitation(
      invitation.userId,
      invitation.type,
      invitation.image,
      invitation.content,
      invitation.date,
      invitation.place,
      invitation.owners
    );
  }

  addInvitation(
    userId: string,
    type: InvitationType,
    image: string,
    content: string,
    date: Date,
    place: Place,
    owners: string[]
  ) {
    const newInvitation = new Invitation(
      type,
      image,
      content,
      date,
      place,
      owners,
      userId
    );

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .post<{ name: string }>(
            `${this.invitationsUrl}.json?auth=${token}`,
            newInvitation
          )
          .pipe(
            switchMap((res) => {
              // res['name'] - the generated id got from the response
              newInvitation.id = res.name;
              return this.invitations;
            }),
            take(1),
            tap((invitations) => {
              return this._invitations.next(invitations.concat(newInvitation));
            })
          );
      })
    );
  }

  editInvitation(
    id: string,
    userId: string,
    type: InvitationType,
    image: string,
    content: string,
    date: Date,
    place: Place,
    owners: string[]
  ) {
    let updatedInvitations: Invitation[];
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.invitations.pipe(
          take(1),
          switchMap((invitations) => {
            const updatedInvitationIndex = invitations.findIndex(
              (p) => p.id === id
            );
            updatedInvitations = [...invitations];
            updatedInvitations[updatedInvitationIndex].userId = userId;
            updatedInvitations[updatedInvitationIndex].type = type;
            updatedInvitations[updatedInvitationIndex].image = image;
            updatedInvitations[updatedInvitationIndex].content = content;
            updatedInvitations[updatedInvitationIndex].date = date;
            updatedInvitations[updatedInvitationIndex].place = place;
            updatedInvitations[updatedInvitationIndex].owners = owners;

            return this.http.put(
              `${this.invitationsUrl}/${id}.json?auth=${token}`,
              {
                ...updatedInvitations[updatedInvitationIndex],
                id: null,
              }
            );
          }),
          tap(() => {
            this._invitations.next(updatedInvitations);
          })
        );
      })
    );
  }

  approveInvitation(
    id: string,
    userName: string,
    userPhone: string,
    approveStatus: string,
    totalPeople: number,
    note: string
  ): Observable<void> {
    const newUserApproveInvitation = new UserApproveInvitation(
      id,
      userName,
      userPhone,
      approveStatus,
      totalPeople,
      note
    );

    return this.http.post<void>(
      `${this.userApproveInvitationsUrl}.json`,
      newUserApproveInvitation
    );
  }

  fetchUserApproveInvitations(): Observable<UserApproveInvitation[]> {
    return this.http
      .get<{ [key: string]: Invitation }>(
        `${this.userApproveInvitationsUrl}.json`
      )
      .pipe(
        map((res) => {
          const userApproveInvitations = [];
          for (const key in res) {
            const invitation = res[key];
            invitation.id = key;
            userApproveInvitations.push(invitation);
          }
          return userApproveInvitations;
        }),
        tap((userApproveInvitations) => {
          this._userApproveInvitations.next(userApproveInvitations);
        })
      );
  }

  getUsersApproveInvitation(
    invitationId: string
  ): Observable<UserApproveInvitation[]> {
    return this.userApproveInvitations.pipe(
      take(1),
      map((userApproveInvitation) => {
        return {
          ...userApproveInvitation.filter(
            (p) => p.invitationId === invitationId
          ),
        };
      })
    );
  }

  fetchInvitationTypes(): Observable<InvitationType[]> {
    return this.http
      .get<{ [key: string]: InvitationType }>(`${this.invitationTypesUrl}.json`)
      .pipe(
        map((res) => {
          const invitationTypes = [];
          for (const key in res) {
            const invitationType = res[key];
            invitationType.id = key;
            invitationTypes.push(invitationType);
          }
          return invitationTypes;
        }),
        tap((invitationTypes) => {
          this._invitationTypes.next(invitationTypes);
        })
      );
  }

  addInvitationType(type: InvitationType) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<{ name: string }>(
          `${this.invitationTypesUrl}.json?auth=${token}`,
          type
        );
      })
    );
  }
}
