export class Invitation {
  public id: string;
  constructor(
    public type: InvitationType,
    public image: string,
    public content: string,
    public date: Date,
    public place: Place,
    public owners: string[],
    public userId: string
  ) {}
}

export interface Place {
  name: string;
  location: string;
  website: string;
  phone: string;
  facebook: string;
  image: string;
}

export class InvitationType {
  public id: string;

  constructor(
    public name: string,
    public faIcon: string,
    public image: string
  ) {}
}

export class UserApproveInvitation {
  constructor(
    public invitationId: string,
    public userName: string,
    public userPhone: string,
    public approveStatus: string,
    public totalPeople: number,
    public note: string
  ) {}
}
