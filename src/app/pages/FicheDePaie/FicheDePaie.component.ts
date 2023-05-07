import {Component, OnInit} from '@angular/core';
import { FicheDePaie } from 'src/app/FicheDePaie';
import { EventService } from 'src/app/demo/service/eventservice'; 
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
    templateUrl: './FicheDePaie.component.html',
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }

        @media screen and (max-width: 960px) {
            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
                text-align: center;
            }

            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
                display: flex;
            }
        }

    `],
    providers: [MessageService, ConfirmationService]
})
export class FdpComponent implements OnInit {

    fdpDialog!: boolean;

    fdp!: FicheDePaie[];

    fdpi!: FicheDePaie;
    data!: any;

    selectedFdp!: FicheDePaie[];
    selectedFDPShow!:FicheDePaie;
    submitted!: boolean;

    updateFDPDialog! : boolean; 
    consultFDPDialog! : boolean;

    cols!: any[];

    constructor(private eventService: EventService, private messageService: MessageService,
                private confirmationService: ConfirmationService) {}

    ngOnInit() {
        
        this.eventService.getAllFdp().subscribe(data => this.fdp = data);
        

        this.cols = [
            {field: 'ficheId', header: 'id'},
            {field: 'timeSpent', header: 'timeSpent'},
            {field: 'description', header: 'description'},
            {field: 'date', header: 'date'},
            {field: 'projectName', header: 'projectName'},
            {field: 'idResponsible', header: 'idResponsible'},
            {field: 'idCollaborator', header: 'idCollaborator'},
            {field: 'comment', header: 'comment'},
            {field: 'productivity', header: 'productivity'},
            {field: 'approve', header: 'approve'},
        ];
        console.log(this.data);
    }
    updateData(){
        this.submitted=true;
        this.eventService.updateFdp(this.fdpi).subscribe(res =>{
            this.eventService.getAllFdp().subscribe(next => {
                this.fdpi=res;
                console.log(res);
            });
            this.updateFDPDialog=false;
        });
    }
    showFDPDialog(fdpi:FicheDePaie){
        this.selectedFDPShow=fdpi;
        console.log(fdpi)
        this.consultFDPDialog=true;
    }
    openNew() {
        this.fdpi = {
            ficheId:'',
            timeSpent:'',
            description:'',
            date:new Date(),
            projectName:'',
            idResponsible:'',
            idCollaborator:'',
            comment:'',
            productivity:0.50,
            approve:true,
        };
        this.submitted = false;
        this.fdpDialog = true;
    }

    deleteSelectedFdp() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected FDP?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.fdp = this.fdp.filter(val => !this.selectedFdp.includes(val));
                this.selectedFdp = [];
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Fdp Deleted', life: 3000});
            }
        });
    }

    editFDP(fdpi:FicheDePaie) {
        this.fdpi = {...fdpi};
        console.log(fdpi)
        this.updateFDPDialog = true;
    }

    deleteFdp(fdpi: FicheDePaie) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + fdpi.ficheId + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.fdp = this.fdp.filter(val => val.ficheId !== fdpi.ficheId);
                this.fdpi = {
                    ficheId:'',
                    timeSpent:'',
                    description:'',
                    date:new Date(),
                    projectName:''
                };
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'FDP Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.fdpDialog = false;
        this.submitted = false;
        this.updateFDPDialog=false;
    }

    saveFdp() {
        this.submitted = true;
        
        if (this.fdpi.ficheId) {
        this.eventService.updateFdp(this.fdpi).subscribe(res => {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'FDP Updated', life: 3000});
        this.fdp = [...this.fdp];
        this.fdpDialog = false;
        
        });
        } else {
        this.eventService.addFdp(this.fdpi).subscribe(res => {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'FDP Created', life: 3000});
        this.fdp.push(res);
        this.fdp = [...this.fdp];
        this.fdpDialog = false;
        });
        }
        
       
        this.fdpi = {timeSpent:'',description:'',date:new Date(),ficheId:'',projectName:'',idResponsible:'',idCollaborator:'',comment:'',productivity:0.50,approve:true};
    }
   
    
}