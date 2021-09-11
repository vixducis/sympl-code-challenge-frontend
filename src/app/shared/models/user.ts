export interface UserJson {
    id: number;
    name: string;
    role: string;
    mail: string;
    image: string;
    relationships: {
        projects: Array<number>
    }
}

export class User {
    constructor(
        public id: number,
        public name: string,
        public role: string,
        public mail: string,
        public image: string,
        public projects: Array<number>
    ) {}
    
    public static fromJson(json: UserJson): User {
        return new User(
            json.id,
            json.name,
            json.role,
            json.mail,
            json.image,
            json.relationships.projects
        );
    } 
}