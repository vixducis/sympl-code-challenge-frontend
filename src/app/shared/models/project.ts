export interface ProjectJson {
    id: number;
    name: string;
    color: string;
}

export class Project {
    constructor(
        public id: number,
        public name: string,
        public color: string
    ) {}
    
    public static fromJson(json: ProjectJson): Project {
        return new Project(
            json.id,
            json.name,
            json.color
        );
    } 
}