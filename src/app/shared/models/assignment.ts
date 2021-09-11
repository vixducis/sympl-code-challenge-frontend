export interface AssignmentJson {
    id: number;
    project_id: string;
    user_id: string;
}

export class Assignment {
    constructor(
        public id: number,
        public projectId: string,
        public userId: string
    ) {}
    
    public static fromJson(json: AssignmentJson): Assignment {
        return new Assignment(
            json.id,
            json.project_id,
            json.user_id
        );
    } 
}