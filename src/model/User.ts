export class User {
  Id: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  AvatarUrl: string;
  Password: string;
  Email: string;
  Gender: string;
  Birthday: string;
  LanguageId: string;
  Provider: string;
  ProviderKey: string;
 
  constructor() {
    this.Id = null;
    this.UserName = null;
    this.FirstName = null;
    this.LastName = null;
    this.AvatarUrl = null;
    this.Password = null;
    this.Email = null;
    this.Gender = null;
    this.Birthday = null;
    this.LanguageId = null;
    this.Provider = null;
    this.ProviderKey = null;
  }
}