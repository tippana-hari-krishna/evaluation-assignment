import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import {formatDate} from '@angular/common'

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';

@Component({ templateUrl: "audit.component.html" })
export class AuditComponent implements OnInit {
  audits : Audit[];
  masterAudits : Audit[]
  current: number = 0;
  pageLimit: number = 10;
  headers = [
    {headerName : 'ID', propName: 'id', sortIcon: sortIcon.none},
    {headerName : 'User', propName: 'user', sortIcon: sortIcon.none},
    {headerName : 'Login Time', propName: 'loginTime', sortIcon: sortIcon.none},
    {headerName : 'Logout Time', propName: 'logoutTime', sortIcon: sortIcon.none},
    {headerName : 'IP', propName: 'ip', sortIcon: sortIcon.none},
  ]

  constructor(
    private authenticationService: AuthenticationService,
    private auditService: AuditService
  ) {}

  ngOnInit() {
    this.loadAllAudits();
  }

  private loadAllAudits() {
    this.auditService
      .getAll()
      .pipe(first())
      .subscribe((audits:any) => {
        this.audits = audits
        this.masterAudits = this.audits.map(item=> Object.assign({},item))
      } );
  }

  sort(currentHeader: any) {

    this.headers.forEach((header) => {
        if (header.headerName != currentHeader.headerName) {
          header.sortIcon = sortIcon.none;
        }
      });
  
      //Changing SortIcon for currentHeader
      if (currentHeader.sortIcon === sortIcon.none) {
        currentHeader.sortIcon = sortIcon.asc;
      } else if (currentHeader.sortIcon === sortIcon.asc) {
        currentHeader.sortIcon = sortIcon.desc;
      } else currentHeader.sortIcon = sortIcon.asc;

    const column = currentHeader.propName as keyof Audit;
    if (currentHeader.sortIcon == sortIcon.asc) {
      this.audits.sort((a, b) => {
        return a[column] > b[column] ? 1 : -1;
      });
    } else if (currentHeader.sortIcon == sortIcon.desc) {
      this.audits.sort((a, b) => {
        return a[column] < b[column] ? 1 : -1;
      });
    }
  }
  filter() {
    const idValue = (document.getElementById('id') as HTMLInputElement).value
    const userValue = (document.getElementById('user') as HTMLInputElement).value
    const loginTimeValue = (document.getElementById('loginTime') as HTMLInputElement).value
    const logoutTimeValue = (document.getElementById('logoutTime') as HTMLInputElement).value
    const ipValue = (document.getElementById('ip') as HTMLInputElement).value
    
    this.audits = this.masterAudits.map(item=> Object.assign({},item))

    if(idValue && idValue!='') {
        this.audits = this.audits.filter(item=> item.id.includes(idValue))    
    }

    if(userValue && userValue!='') {
        this.audits = this.audits.filter(item=> item.user.includes(userValue))    
    }

    if(loginTimeValue && loginTimeValue!='') {
        this.audits = this.audits.filter(item=> {
            var cellValue = item.loginTime as string
            cellValue = formatDate(cellValue,'dd/MM/yyyy hh:mm:ss','en-US') 
            return cellValue.includes(loginTimeValue)
        } )    
    }

    if(logoutTimeValue && logoutTimeValue!='') {
        this.audits = this.audits.filter(item=> {
            var cellValue = item.logoutTime as string
            cellValue = formatDate(cellValue,'dd/MM/yyyy hh:mm:ss','en-US') 
            return cellValue.includes(logoutTimeValue)
        } )
    }

    if(ipValue && ipValue!='') {
        this.audits = this.audits.filter(item=> item.ip.includes(ipValue))    
    }
  }
}


export enum sortIcon {
    none = '↕️',
    asc = '⬇️',
    desc = '⬆️'
}
