/*
 * Nanocloud Community, a comprehensive platform to turn any application
 * into a cloud solution.
 *
 * Copyright (C) 2015 Nanocloud Software
 *
 * This file is part of Nanocloud community.
 *
 * Nanocloud community is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Nanocloud community is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/// <reference path='../../../typings/tsd.d.ts' />

module hapticFrontend {
	"use strict";

	class ApplicationsCtrl {

		gridOptions: any;

		static $inject = [
			"ApplicationsService",
			"$mdDialog",
			"$cookies"
		];

		constructor(
			private applicationsSrv: ApplicationsService,
			private $mdDialog: angular.material.IDialogService,
			private $cookies: angular.cookies.ICookiesService
		) {
			this.gridOptions = {
				data: [],
				rowHeight: 36,
				columnDefs: [
					{ field: "ConnectionName" },
					{ field: "Port" },
					{ field: "RemoteApp" },
					{
						name: "actions",
						displayName: "",
						enableColumnMenu: false,
						cellTemplate: "\
							<md-button ng-click='grid.appScope.applicationsCtrl.openApplication($event, row.entity)'>\
								<ng-md-icon icon='pageview' size='14'></ng-md-icon> Open\
							</md-button>\
							<md-button ng-click='grid.appScope.applicationsCtrl.startUnpublishApplication($event, row.entity)'>\
								<ng-md-icon icon='delete' size='14'></ng-md-icon> Unpublish\
							</md-button>"
					}
				]	
			};

			this.loadApplications();
		}

		get applications(): IApplication[] {
			return this.gridOptions.data;
		}
		set applications(value: IApplication[]) {
			this.gridOptions.data = value;
		}

		loadApplications(): angular.IPromise<void> {
			return this.applicationsSrv.getAll().then((applications: IApplication[]) => {
				this.applications = applications;
			});
		}

		startUnpublishApplication(e: MouseEvent, application: IApplication) {
			let o = this.$mdDialog.confirm()
				.parent(angular.element(document.body))
				.title("Unpublish application")
				.content("Are you sure you want to unpublish this application?")
				.ok("Yes")
				.cancel("No")
				.targetEvent(e);
			this.$mdDialog
				.show(o)
				.then(this.unpublishApplication.bind(this, application));
		}

		unpublishApplication(application: IApplication) {
			this.applicationsSrv.unpublish(application);

			let i = _.findIndex(this.applications, (x: IApplication) => x.RemoteApp === application.RemoteApp);
			if (i >= 0) {
				this.applications.splice(i, 1);
			}
		}

		openApplication(e: MouseEvent, application: IApplication) {
			this.$cookies.remove("JSESSIONID");
			let applicationToken = btoa(application.ConnectionName + "\0c\0noauthlogged");
			window.open("/guacamole/#/client/" + applicationToken, "_blank");
		}
	}

	app.controller("ApplicationsCtrl", ApplicationsCtrl);
}
