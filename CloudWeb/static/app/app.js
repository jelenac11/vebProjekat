const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }
const VirtuelneMasine = { template: '<virtuelne-masine></virtuelne-masine>' }
const Diskovi = { template: '<diskovi></diskovi>' }
const Kategorije = { template: '<kategorije></kategorije>' }
const Organizacije = { template: '<organizacije></organizacije>' }
const Korisnici = { template: '<korisnici></korisnici>' }
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
	    { path: '/virtuelnemasine', component: VirtuelneMasine },
	    { path: '/diskovi', component: Diskovi },
	    { path: '/kategorije', component: Kategorije },
	    { path: '/organizacije', component: Organizacije },
	    { path: '/korisnici', component: Korisnici },
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