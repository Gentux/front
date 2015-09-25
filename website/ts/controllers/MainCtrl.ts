/// <reference path='../../../typings/tsd.d.ts' />

module hapticFrontend {
	"use strict";

	class MainCtrl {

		nav: models.MainNav;
		user: string;

		static $inject = [
			"$location"
		];
		constructor(
			private $location: angular.ILocationService
		) {
			this.nav = new models.MainNav();
			let m = _.find(this.nav.menus, (x: models.INavMenu) => x.url === $location.url());
			if (m) {
				this.nav.current = m;
			}
			this.user = sessionStorage.getItem("user");
		}

		navigateTo(menu: models.INavMenu) {
			this.$location.path(menu.url);
			this.nav.current = menu;
		}

	}

	app.controller("MainCtrl", MainCtrl);
}
