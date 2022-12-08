export class BanInfoModel {
  constructor(
    public id: string,
    public isBanned: boolean,
    public banDate: Date | null,
    public banReason: string | null,
  ) {}
}
