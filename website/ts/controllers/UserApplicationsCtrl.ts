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

	class UserApplicationCtrl {

		applications: any;
		user: string;

		static $inject = [
			"ApplicationsService"
		];

		constructor(
			private applicationsSrv: ApplicationsService
		) {
			this.loadApplications();
			this.user = sessionStorage.getItem("user");
		}

		loadApplications(): angular.IPromise<void> {
			return this.applicationsSrv.getApplicationForUser().then((applications: IApplication[]) => {
				this.applications = applications;
			});
		}

		openApplication(application: IApplication, e: MouseEvent) {
			this.applicationsSrv.clearCookies();
			let applicationToken = btoa(application.ConnectionName + "\0c\0noauthlogged");
			window.open("/guacamole/#/client/" + applicationToken, "_blank");
		}

		navigateTo(loc: string, e: MouseEvent) {
			window.open(loc, "_blank");
		}
	}

	app.controller("UserApplicationCtrl", UserApplicationCtrl);
}
