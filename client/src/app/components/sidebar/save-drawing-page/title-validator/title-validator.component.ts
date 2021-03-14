import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-title-validator',
    templateUrl: './title-validator.component.html',
    styleUrls: ['./title-validator.component.scss'],
})
export class TitleValidatorComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    // Title empty
    // Title ascii
    // Title max length 20 chars
    //   private isTitleValid(title: string): boolean {
    //     if (title === '') {
    //         alert('Title cannot be empty!');
    //         return false;
    //     }
    //     return true;
    // }
}
