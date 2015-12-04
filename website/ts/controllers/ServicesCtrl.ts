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

	class ServicesCtrl {

		colors: any;

		static $inject = [
			"ServicesService",
			"IaasFactory",
			"$mdDialog"
		];

		constructor(
			private servicesSrv: ServicesService,
			private iaasFct: IaasFactory,
			private $mdDialog: angular.material.IDialogService
		) {
			this.colors = {
				downloading: "#4183D7",
				available: "#A2DED0",
				booting: "#EB9532",
				running: "#26A65B"
			};
		}

		get services(): IService[] {
			return this.iaasFct.services; 
		}
		set services(value: IService[]) {
			this.iaasFct.services = value;
		}

		startWindowsDownload(e: MouseEvent, service: IService) {
			let o = this.getDefaultServiceDlgOpt(e);
			o.locals = { service: service };
			return this.$mdDialog.show(o);
		}

		toggle(service: IService) {
			if (! service.Locked) {
				if (service.Status === "running") {
					this.servicesSrv.startStopService(service);
				} else {
					this.servicesSrv.start(service);
				}
			}
		}

		private getDefaultServiceDlgOpt(e: MouseEvent): angular.material.IDialogOptions {
			return {
				controller: "ServiceCtrl",
				controllerAs: "serviceCtrl",
				templateUrl: "./views/service.html",
				parent: angular.element(document.body),
				targetEvent: e
			};
		}


	}

	app.controller("ServicesCtrl", ServicesCtrl);
}
