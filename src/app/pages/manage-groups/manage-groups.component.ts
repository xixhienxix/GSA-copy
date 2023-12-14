import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { IUser } from '../../auth/_models/usuario.model';
import { Project } from '../../_models/project.model';
import { IconService, ModalButtonType, ModalService, Table, TableHeaderItem, TableItem, TableModel, OverflowMenu  } from 'carbon-components-angular';
import { environment } from '../../../environments/environment';
import { InputModaComponent } from '../../modals/input-modal/input-modal.component';
import { IGroup } from '../../_models/groups.model';
import { GroupsService } from '../../_services/groups.service';

@Component({
  selector: 'groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss']
})

// Class that feeds Account Information screen
export class ManageGroupsComponent implements OnInit {
  @Input() currentUser: IUser = null;
  @Input() size = "md";
	@Input() showSelectionColumn = false;
	@Input() enableSingleSelect = false;
	@Input() striped = true;
	@Input() isDataGrid = true;
	@Input() noData = false;
	@Input() stickyHeader = false;
	@Input() skeleton = false;
  @Input() sortable = true;
  @Input() title = "Groups";
  @Input() description = "Manage groups";

  @ViewChild("overflowMenuItemTemplate", { static: false }) overflowMenuItemTemplate: TemplateRef<any>;

	model = new TableModel();

  message:string = '';
  loading: boolean = false;
  groups = [];
  groupsCount:number;
  selected:number;
  openModal: boolean = false;
  addGroupName: string = "";

  currentActionGroupName: string;

  constructor(private _groupsService:GroupsService, protected modalService: ModalService) {
  }

  ngOnInit() {
    this.model.header = [
      new TableHeaderItem({
        data: "Groups Name"
      }),
      new TableHeaderItem({
        data: "Actions"
      })
    ];
    this.getGroups(sessionStorage.getItem('uid'));
  }

  getGroups(username:string) {
    this.loading = true;
    this.noData = false;
    this.groups = [];
    this.model.data = [];
    let count = 0;

    this._groupsService.getGroups().subscribe(
      (value:IGroup)=>{
        let groups=[]
        this.noData = true;

        console.log(value)
        this.groupsCount=value.managerof_group.length;
        for(let i=0; i<value.managerof_group.length;i++){
          count += 1;

          groups = [
            new TableItem(
              {
                'data': value.managerof_group[i]
              }
            ),
            new TableItem(
                { 
                  data: { 
                    id: count 
                  }, 
                  template: this.overflowMenuItemTemplate 
                }
              ),
          ]
          this.groups.push(groups)

        }
        this.model.data = this.groups;

    },
    (err)=>{
      if(err)
                {
                this.noData = true;
                this.loading=false;
                if(err.statusText=='Uknown Error')
                {          this.message='Getting projects failed'        }
                else {           this.message='Getting projects failed'        }
                }
    },
    ()=>{
      if (this.groups.length === this.groupsCount){
        this.loading = false;
      }
    })
  }

  onAddNewGroupClick(){
    if (this.addGroupName !== undefined && this.addGroupName !== ""){
      this.toggleModal();
			this.addGroup(this.addGroupName);
		}
		else {
			console.log("No project name entered")
		}
	}

  onKey(event: Event) {
		this.addGroupName = (event.target as HTMLInputElement).value;
	}

  addGroup(projectName: string) {
    this.loading = true;
    this.noData = false;
    this._groupsService.addGroup(projectName).subscribe((resp) => {
      this.getGroups(sessionStorage.getItem('uid'));
    },
    (err) =>{
      console.log(err);
      this.loading = false;
    },
    () =>{
    });
  }
  

  onRowClick(index: number) {
    this.currentActionGroupName = this.groups[index][0]['data'];
  }


  deleteGroup(event:Event) {
    this.loading = true;
    this._groupsService.deleteGroup(sessionStorage.getItem('uid'), this.currentActionGroupName).subscribe((resp) => {
        console.log(resp);
        this.getGroups(sessionStorage.getItem('uid'));
    },
    (err) => {
        console.log(err);
        this.loading = false;
    },
    () => {
    });
  }


  toggleModal() {
    this.openModal = !this.openModal
  }


}