const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }
const IzmenaProfila = { template: '<izmena-profila></izmena-profila>' }
const DodavanjeOrganizacije = { template: '<dodavanje-organizacije></dodavanje-organizacije>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	    { path: '/superadmin', component: SuperAdmin },
	    { path: '/izmenaProfila', component: IzmenaProfila },
	    { path: '/dodavanjeOrganizacije', component: DodavanjeOrganizacije },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});