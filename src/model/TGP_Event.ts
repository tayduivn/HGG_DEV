export class TGP_Event {
  id: number;
  name: string;
  description: string;
  imgURL: string;
 
  constructor(id: number, name: string, description: string, imgURL: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imgURL = imgURL;
  }
}