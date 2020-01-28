const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }
const Admin = { template: '<admin></admin>' }
const IzmenaProfila = { template: '<izmena-profila></izmena-profila>' }
const DodavanjeOrganizacije = { template: '<dodavanje-organizacije></dodavanje-organizacije>' }
const DodavanjeKorisnika = { template: '<dodavanje-korisnika></dodavanje-korisnika>' }
const DodavanjeKategorije = { template: '<dodavanje-kategorije></dodavanje-kategorije>' }
const DodavanjeMasine = { template: '<dodavanje-masine></dodavanje-masine>' }
const DodavanjeDiska = { template: '<dodavanje-diska></dodavanje-diska>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	    { path: '/superadmin', component: SuperAdmin },
	    { path: '/admin', component: Admin },
	    { path: '/izmenaProfila', component: IzmenaProfila },
	    { path: '/dodavanjeOrganizacije', component: DodavanjeOrganizacije },
	    { path: '/dodavanjeKorisnika', component: DodavanjeKorisnika },
	    { path: '/dodavanjeKategorije', component: DodavanjeKategorije },
	    { path: '/dodavanjeMasine', component: DodavanjeMasine },
	    { path: '/dodavanjeDiska', component: DodavanjeDiska },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});