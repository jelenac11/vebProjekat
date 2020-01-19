const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }
const IzmenaProfila = { template: '<izmena-profila></izmena-profila>' }
const DodavanjeOrganizacije = { template: '<dodavanje-organizacije></dodavanje-organizacije>' }
const DodavanjeKorisnika = { template: '<dodavanje-korisnika></dodavanje-korisnika>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	    { path: '/superadmin', component: SuperAdmin },
	    { path: '/izmenaProfila', component: IzmenaProfila },
	    { path: '/dodavanjeOrganizacije', component: DodavanjeOrganizacije },
	    { path: '/dodavanjeKorisnika', component: DodavanjeKorisnika },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});