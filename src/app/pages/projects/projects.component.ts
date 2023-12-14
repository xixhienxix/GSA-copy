import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ProjectsService } from '../../_services/projects.service';
import { IUser } from '../../auth/_models/usuario.model';
import { Project } from '../../_models/project.model';
import { IconService, ModalButtonType, ModalService, Table, TableHeaderItem, TableItem, TableModel, OverflowMenu  } from 'carbon-components-angular';
import { environment } from '../../../environments/environment';
import { InputModaComponent } from '../../modals/input-modal/input-modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

// Class that feeds Account Information screen
export class ProjectsComponent implements OnInit {
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
  @Input() title = "Projects";
  @Input() description = "Manage projects";

  @ViewChild("overflowMenuItemTemplate", { static: false }) overflowMenuItemTemplate: TemplateRef<any>;

	model = new TableModel();

  message:string = '';
  loading: boolean = false;
  projects = [];
  projectCount:number;
  selected:number;
  openModal: boolean = false;
  addProjectName: string = "";

  currentActionProjectName: string;

  constructor(private _projectsService:ProjectsService, protected modalService: ModalService) {
  }

  ngOnInit() {
    this.model.header = [
      new TableHeaderItem({
        data: "Project Name"
      }),
      new TableHeaderItem({
        data: "Quota (GB)"
      }),
      new TableHeaderItem({
        data: "Space Used (GB)"
      }),
      new TableHeaderItem({
        data: "Actions"
      })
    ];
    this.getProjects(sessionStorage.getItem('uid'));
  }

  getProjects(username:string = sessionStorage.getItem('uid')) {
    this.loading = true;
    this.noData = false;
    this.projects = [];
    this.model.data = [];
    this._projectsService.getProjects(username).subscribe(
      (value)=> 
      {
        this.projectCount = value.length;
        if (value.length === 0){
          this.noData = true;
          this.loading = false;
        } else {
          this.noData = false;
          let count = 0;
          value.forEach((project) => {
            count += 1;
            this._projectsService.getQuota(sessionStorage.getItem('uid'),project.filesetName).subscribe(
              (value)=> 
              {
                let formattedProject;
                if (project.filesetName !== this.addProjectName) {
                  formattedProject = [
                    new TableItem(
                      {
                        'data': project.filesetName
                      }
                    ),
                    new TableItem(
                      {
                      'data': Math.round((value/(10**6)))
                      }
                    ),
                    new TableItem(
                      {
                      'data': (project.usage.usedBytes/(10**9)).toFixed(3)
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

                  ];
                } else {
                  formattedProject = [
                    new TableItem(
                      {
                        'data': project.filesetName
                      }
                    ),
                    new TableItem(
                      {
                      'data': 10
                      }
                    ),
                    new TableItem(
                      {
                      'data': Math.round(0).toFixed(3)
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

                  ];
                }
                this.projects.push(formattedProject);
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
                if (this.projects.length === this.projectCount){
                  this.model.data = this.projects;
                  this.loading = false;
                }
            });
          });
        }
      },
      (err)=>{
        if(err)
			  {
				this.loading=false;
        this.noData = true;
				if(err.statusText=='Uknown Error')
                {          this.message='Getting projects failed'        }
                else {           this.message='Getting projects failed'        }
			  }
      },
      ()=>{
    });
  }

  onRowClick(index: number) {
    this.currentActionProjectName = this.projects[index][0]['data'];
  }

  deleteProject(event:Event) {
    this.loading = true;
    this._projectsService.deleteProject(sessionStorage.getItem('uid'), this.currentActionProjectName).subscribe((resp) => {
        console.log(resp);
        this.getProjects(sessionStorage.getItem('uid'));
    },
    (err) => {
        console.log(err);
        this.loading = false;
    },
    () => {
    });
  }

  addProject(projectName: string) {
    this.loading = true;
    this.noData = false;
    this._projectsService.addProject(sessionStorage.getItem('uid'), projectName).subscribe((resp) => {
      this.getProjects();
    },
    (err) =>{
      console.log(err);
      this.loading = false;
    },
    () =>{
    });
  }

  toggleModal() {
    this.openModal = !this.openModal
  }


	onKey(event: Event) {
		this.addProjectName = (event.target as HTMLInputElement).value;
	}

  onAddProjectClick(){
		if (this.addProjectName !== undefined && this.addProjectName !== ""){
      this.toggleModal();
			this.addProject(this.addProjectName);
		}
		else {
			console.log("No project name entered")
		}
	}

	onSearchKeyDown(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if (filterValue !== undefined && filterValue !== ""){
			this.model.data = this.projects.filter((value)=>(value[0]['data'].toLowerCase().indexOf(filterValue.toLowerCase()) >= 0));
		}
		else {
			this.model.data = this.projects;
		}
	}
}
