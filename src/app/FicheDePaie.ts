export interface FicheDePaie{

    ficheId?: string;
    timeSpent? : string;
    description? : string;
    date? : Date;
    projectName? : string;
    idResponsible?:string;
    idCollaborator?:string;
    comment?:string;
    productivity?:ConstrainDouble;
    approve?:boolean;

}